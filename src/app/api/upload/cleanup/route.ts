import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { paths } = await request.json();

    if (!Array.isArray(paths)) {
      return NextResponse.json(
        { error: 'Paths должен быть массивом' },
        { status: 400 }
      );
    }

    const results = await Promise.allSettled(
      paths.map(async (path) => {
        try {
          // Извлекаем имя файла из пути
          const fileName = path.split('/').pop();
          if (!fileName) {
            throw new Error('Неверный путь к файлу');
          }

          const filePath = join(process.cwd(), 'public', 'temp-uploads', fileName);

          // Проверяем существование файла перед удалением
          if (existsSync(filePath)) {
            await unlink(filePath);
            return { path, success: true };
          } else {
            return { path, success: false, reason: 'Файл не найден' };
          }
        } catch (error) {
          return { path, success: false, error: (error as Error).message };
        }
      })
    );

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Ошибка при очистке файлов:', error);
    return NextResponse.json(
      { error: 'Не удалось очистить временные файлы' },
      { status: 500 }
    );
  }
} 