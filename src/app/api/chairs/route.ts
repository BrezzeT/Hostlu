import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const chairs = await prisma.product.findMany({
      where: {
        category: {
          name: 'Стулья'
        }
      },
      include: {
        category: true,
        subCategory: true,
      },
    });

    return NextResponse.json(chairs);
  } catch (error) {
    console.error('Error fetching chairs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chairs' },
      { status: 500 }
    );
  }
} 