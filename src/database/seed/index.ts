import { prisma } from '../client';
import { createPostData } from './post';
import { createUserData } from './user';
async function truncate() {
  await prisma.post.$truncate();
  await prisma.user.$truncate();
}
async function seed() {
  try {
    await truncate();
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
