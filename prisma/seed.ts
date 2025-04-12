import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Создаем категорию "Стулья"
  const chairsCategory = await prisma.category.upsert({
    where: { slug: 'chairs' },
    update: {},
    create: {
      name: 'Стулья',
      slug: 'chairs',
      subCategories: {
        create: [
          {
            name: 'Барные',
            slug: 'bar-chairs',
          },
          {
            name: 'Обеденные',
            slug: 'dining-chairs',
          },
        ],
      },
    },
  });

  // Создаем другие категории
  const sofasCategory = await prisma.category.upsert({
    where: { slug: 'sofas' },
    update: {},
    create: {
      name: 'Диваны и кресла',
      slug: 'sofas',
    },
  });

  const bedsCategory = await prisma.category.upsert({
    where: { slug: 'beds' },
    update: {},
    create: {
      name: 'Кровати',
      slug: 'beds',
    },
  });

  const ottomansCategory = await prisma.category.upsert({
    where: { slug: 'ottomans' },
    update: {},
    create: {
      name: 'Банкетки и пуфики',
      slug: 'ottomans',
    },
  });

  const tablesCategory = await prisma.category.upsert({
    where: { slug: 'tables' },
    update: {},
    create: {
      name: 'Столы',
      slug: 'tables',
    },
  });

  // Создаем администратора
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('База данных успешно заполнена тестовыми данными');
  console.log({ chairsCategory, sofasCategory, bedsCategory, ottomansCategory, tablesCategory });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 