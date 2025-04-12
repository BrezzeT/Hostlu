export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Заменяем пробелы на дефисы
    .replace(/[^\w\-]+/g, '')       // Удаляем все не-буквенно-цифровые символы
    .replace(/\-\-+/g, '-')         // Заменяем множественные дефисы на один
    .replace(/^-+/, '')             // Удаляем дефисы с начала строки
    .replace(/-+$/, '');            // Удаляем дефисы с конца строки
} 