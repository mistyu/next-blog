import { prisma } from '../client';
import { createPostData } from './post';
import { createUserData } from './user';

async function seed() {
  try {
    await createUserData();
    await createPostData();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  await prisma.$disconnect();
  process.exit();
}

seed();
