const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking database connection...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
      }
    });

    console.log(`Found ${users.length} users:\n`);

    if (users.length === 0) {
      console.log('❌ No users in database!');
      console.log('👉 You need to sign up at: http://localhost:3000/auth/signup\n');
    } else {
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log(`  📧 Email: ${user.email}`);
        console.log(`  👤 Name: ${user.name || 'Not set'}`);
        console.log(`  ✉️  Verified: ${user.emailVerified ? '✅ Yes' : '❌ No'}`);
        console.log(`  📅 Created: ${user.createdAt.toLocaleString()}\n`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
