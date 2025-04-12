import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all subcategories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const categoryId = searchParams.get('categoryId');

    if (name && categoryId) {
      // Поиск подкатегории по имени и ID категории
      const subCategory = await prisma.subCategory.findFirst({
        where: {
          name,
          categoryId,
        },
      });
      return NextResponse.json(subCategory);
    }

    // Получение всех подкатегорий
    const subCategories = await prisma.subCategory.findMany();
    return NextResponse.json(subCategories);
  } catch (error) {
    console.error('Error in subcategories API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}

// POST new subcategory
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subCategory = await prisma.subCategory.create({
      data: {
        name: body.name,
        slug: body.name.toLowerCase().replace(/\s+/g, '-'),
        categoryId: body.categoryId,
      },
    });
    return NextResponse.json(subCategory);
  } catch (error) {
    console.error('Error in subcategories API:', error);
    return NextResponse.json(
      { error: 'Failed to create subcategory' },
      { status: 500 }
    );
  }
}

// PUT update subcategory
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, categoryId } = body;

    const slug = name.toLowerCase().replace(/ /g, '-');

    const subcategory = await prisma.subCategory.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update subcategory' }, { status: 500 });
  }
}

// DELETE subcategory
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Subcategory ID is required' }, { status: 400 });
    }

    await prisma.subCategory.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete subcategory' }, { status: 500 });
  }
} 