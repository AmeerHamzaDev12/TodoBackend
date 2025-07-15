// seed.ts
import prisma from './Prisma';  // Adjust path if needed

async function main() {
  // Check if user already exists to avoid duplicates
  const existingUser = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  });

  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'somepassword',  // Remember: hash passwords in real apps!
      },
    });
    console.log('User created:', user);
  } else {
    console.log('User already exists:', existingUser);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
