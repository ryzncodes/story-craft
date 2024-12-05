import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const hashedPassword = await hashPassword('password123');
  
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      username: 'testuser',
      passwordHash: hashedPassword,
      profile: {
        create: {
          displayName: 'Test User',
          bio: 'This is a test user'
        }
      }
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 