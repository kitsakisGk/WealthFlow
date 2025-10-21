import { prisma } from '../lib/prisma';

async function checkUsers() {
  try {
    console.log('Connecting to database...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
      }
    });

    console.log(`\nFound ${users.length} users in database:\n`);
    users.forEach(user => {
      console.log(`- Email: ${user.email}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Email Verified: ${user.emailVerified ? 'Yes' : 'No'}`);
      console.log(`  Created: ${user.createdAt}`);
      console.log('');
    });

    if (users.length === 0) {
      console.log('No users found! You need to sign up first at http://localhost:3000/auth/signup');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
