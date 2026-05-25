import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Модели ГАЗ из фронтенда
const GAZ_MODELS = [
  "ГАЗель NEXT",
  "ГАЗель NN",
  "Соболь NN",
  "Соболь 4x4",
  "Валдай NEXT",
  "ГАЗон NEXT",
  "Садко NEXT",
];

async function main() {
  const saltRounds = 10;

  console.log('--- Начало сидирования ---');

  // 1. Создание администраторов
  const admins = [
    { login: 'admin1', password: 'password123', firstName: 'Иван', lastName: 'Иванов' },
    { login: 'admin2', password: 'securepassword456', firstName: 'Петр', lastName: 'Петров' },
  ];

  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, saltRounds);
    await prisma.admin.upsert({
      where: { login: admin.login },
      update: {},
      create: {
        login: admin.login,
        password: hashedPassword,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    });
  }
  console.log('✅ Администраторы созданы/обновлены');

  const firstNames = ['Александр', 'Дмитрий', 'Сергей', 'Андрей', 'Алексей', 'Максим', 'Евгений', 'Иван', 'Михаил', 'Артем'];
  const lastNames = ['Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов', 'Новиков', 'Федоров'];
  const statuses = ['WAITING', 'ACCEPTED', 'READY'];
  const regions = ['77', '99', '197', '777'];

  console.log('🚀 Генерация 30 заявок с моделями ГАЗ...');

  for (let i = 1; i <= 30; i++) {
    // Генерация случайного номера: буква + 3 цифры + 2 буквы + регион
    const letters = 'АВЕКМНОРСТУХ';
    const randomLetter = () => letters[Math.floor(Math.random() * letters.length)];
    const plate = `${randomLetter()}${Math.floor(100 + Math.random() * 900)}${randomLetter()}${randomLetter()}${regions[Math.floor(Math.random() * regions.length)]}`;

    // Генерация уникального VIN: ZFA + 13 символов (с использованием i для гарантии уникальности)
    const vinSuffix = `${i}${Math.random().toString(36).substring(2, 10)}`.padEnd(13, '0').slice(0, 13);
    const vin = `ZFA${vinSuffix}`;

    const carModel = GAZ_MODELS[Math.floor(Math.random() * GAZ_MODELS.length)];

    await prisma.application.upsert({
      where: { plate: plate },
      update: {},
      create: {
        plate: plate,
        vin: vin,
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        phone: `+79${Math.floor(100000000 + Math.random() * 900000000)}`,
        email: `client${i}@example.com`,
        carModel: carModel,
        photos: '[]',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        message: i % 5 === 0 ? 'Проверка тормозной системы и замена колодок' : null,
      },
    });
  }

  console.log('✅ 30 заявок успешно добавлены');
  console.log('--- Сидирование завершено ---');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при сидировании:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

console.log('Генерация вопросов от клиентов...');

for (let i = 1; i <= 5; i++) {
  await prisma.inquiry.create({
    data: {
      name: `Клиент ${i}`,
      phone: `+7900000000${i}`,
      email: `question${i}@example.com`,
      message: `Здравствуйте, сколько будет стоить покраска детали №${i}?`,
    }
  });
}
console.log('✅ Вопросы добавлены');
