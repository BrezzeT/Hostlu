import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { moveFileToUploads, deleteTempFile } from '../upload/route';
import { Product, Prisma } from '@prisma/client';

interface CreateProductData {
  name: string;
  description?: string;
  price: string | number;
  categoryId: string;
  subCategoryId: string;
  tempImagePaths?: string[];
}

// Функция для проверки подключения к базе данных
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
    return false;
  }
}

// GET all products
export async function GET() {
  console.log('Начало выполнения GET запроса /api/products');
  
  try {
    // Проверяем подключение к базе данных
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('Нет подключения к базе данных');
      return NextResponse.json(
        { error: 'Ошибка подключения к базе данных' },
        { status: 500 }
      );
    }

    console.log('Получаем список товаров...');
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        subCategory: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    console.log(`Найдено ${products.length} товаров`);

    // Преобразуем JSON строки изображений в массивы
    const productsWithParsedImages = products.map(product => {
      try {
        return {
          ...product,
          images: product.images ? JSON.parse(product.images) : []
        };
      } catch (error) {
        console.error(`Ошибка парсинга изображений для товара ${product.id}:`, error);
        return {
          ...product,
          images: []
        };
      }
    });

    return NextResponse.json(productsWithParsedImages);
  } catch (error: any) {
    console.error('Ошибка при получении товаров:', error);
    console.error('Стек ошибки:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Не удалось получить список товаров',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    // Закрываем соединение с базой данных
    await prisma.$disconnect();
  }
}

// POST new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received product creation request:', body);

    // Проверяем обязательные поля
    if (!body.name || !body.price || !body.categoryId || !body.subCategoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Проверяем существование категории
    const category = await prisma.category.findUnique({
      where: { id: body.categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: `Category with ID ${body.categoryId} not found` },
        { status: 404 }
      );
    }

    // Проверяем существование подкатегории
    const subCategory = await prisma.subCategory.findFirst({
      where: {
        id: body.subCategoryId,
        categoryId: body.categoryId
      }
    });

    if (!subCategory) {
      return NextResponse.json(
        { error: `Subcategory with ID ${body.subCategoryId} not found for category ${body.categoryId}` },
        { status: 404 }
      );
    }

    // Создаем продукт
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || '',
        price: parseFloat(String(body.price)),
        dimensions: body.dimensions || '',
        material: body.material || '',
        images: Array.isArray(body.images) ? JSON.stringify(body.images) : '[]',
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        category: {
          connect: { id: body.categoryId }
        },
        subCategory: {
          connect: { id: body.subCategoryId }
        }
      },
      include: {
        category: true,
        subCategory: true
      }
    });

    console.log('Created product:', product);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, price, dimensions, material, categoryId, subCategoryId, images } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        dimensions,
        material,
        images: JSON.stringify(images || []),
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        categoryId,
        subCategoryId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 