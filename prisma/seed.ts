
import prisma from '../src/Prisma';

import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('12345678', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' }, 
    update: {},                           
    create: {                         
      email: 'demo@example.com',
      password: hashedPassword,
    },
  });


  await prisma.todo.createMany({
    data: [
      { title: 'Learn Prisma', completed: false, userId: user.id },
      { title: 'Build Todo App', completed: true, userId: user.id },
    ],
  });

  console.log('🎉✅ Seed data inserted successfully');
}


main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); 
  });
