import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const TEMP_UPLOAD_DIR = join(process.cwd(), 'public', 'temp-uploads');
const FINAL_UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

// Создаем директории, если они не существуют
async function ensureDirectoriesExist() {
  try {
    if (!existsSync(TEMP_UPLOAD_DIR)) {
      await mkdir(TEMP_UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(FINAL_UPLOAD_DIR)) {
      await mkdir(FINAL_UPLOAD_DIR, { recursive: true });
    }
  } catch (error) {
    console.error('Ошибка при создании директорий:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDirectoriesExist();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Файл не загружен' },
        { status: 400 }
      );
    }

    // Проверяем тип файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Разрешены только JPEG, PNG и WebP файлы' },
        { status: 400 }
      );
    }

    // Генерируем уникальное имя файла
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${uuidv4()}.${ext}`;
    const filepath = join(TEMP_UPLOAD_DIR, filename);

    // Конвертируем File в Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Записываем файл
    await writeFile(filepath, buffer);

    return NextResponse.json({ 
      success: true,
      path: `/temp-uploads/${filename}`,
      filename
    });
  } catch (error: any) {
    console.error('Ошибка загрузки:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка загрузки файла' },
      { status: 500 }
    );
  }
}

export async function moveFileToUploads(tempPath: string | null): Promise<string> {
  if (!tempPath) {
    throw new Error('Не указан путь к файлу');
  }

  // Извлекаем имя файла из пути
  const fileName = tempPath.split(/[/\\]/).pop();
  if (!fileName) {
    throw new Error('Неверный путь к файлу');
  }

  const sourcePath = join(process.cwd(), 'public', 'temp-uploads', fileName);
  const targetPath = join(FINAL_UPLOAD_DIR, fileName);
  
  try {
    if (!existsSync(sourcePath)) {
      throw new Error('Исходный файл не найден');
    }

    // Создаем директорию, если её нет
    if (!existsSync(FINAL_UPLOAD_DIR)) {
      await mkdir(FINAL_UPLOAD_DIR, { recursive: true });
    }

    // Читаем и записываем файл
    const buffer = await readFile(sourcePath);
    await writeFile(targetPath, buffer);
    
    // Удаляем временный файл
    await unlink(sourcePath);
    
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Ошибка при перемещении файла:', error);
    throw error;
  }
}

export async function deleteTempFile(tempPath: string | null) {
  if (!tempPath) {
    return; // Silently return if no path provided
  }

  // Extract filename from path, handling both forward and backward slashes
  const fileName = tempPath.split(/[/\\]/).pop();
  if (!fileName) {
    return; // Silently return if invalid path
  }

  const filePath = join(TEMP_UPLOAD_DIR, fileName);
  
  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    console.error('Error deleting temp file:', error);
  }
} 