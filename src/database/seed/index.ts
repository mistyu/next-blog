import { prisma } from '../client';
import { createPostData } from './post';

async function seed() {
  try {
    await createPostData();
  } catch (e) {
    console.error(e, 'seed error');
    process.exit(1);
  }
  await prisma.$disconnect();
  process.exit();
}

seed();
