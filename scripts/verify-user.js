const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyUser() {
  const email = 'jorgitoenespana@gmail.com';

  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    console.log('✅ User verified successfully!');
    console.log('Email:', user.email);
    console.log('You can now login!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUser();
