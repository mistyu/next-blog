import { readFileSync } from 'node:fs';
import path from 'node:path';

import { getRandomInt } from '@/libs/random';

import { prisma } from '../client';

export const createPostData = async () => {
  // 为避免重复添加数据，在重新运行数据填充时，清空已有文章数据
  await prisma.post.$truncate();
  for (let index = 0; index < 22; index++) {
    // await prisma.post.create({
    //   select: { id: true },
    //   data: {
    //     thumb: `/uploads/thumb/post-${getRandomInt(1, 8)}.png`,
    //     title: 'class-validator和class-transformer的中文文档',
    //     body: readFileSync(
    //       path.join(__dirname, '../../app/_components/mdx/content-test.mdx'),
    //       'utf8',
    //     ),
    //     slug: 'class-validator-he-class-transformer-de-zhong-wen-wen-dang',
    //     summary: '一篇markdown测试文章',
    //     keywords: 'nodejs,nestjs,class-validator,class-transformer',
    //     description: '这是一篇markdown测试文章',
    //   },
    // });
  }
  await prisma.post.create({
    select: { id: true },
    data: {
      thumb: `/uploads/thumb/post-${getRandomInt(1, 8)}.png`,
      title: 'class-validator和class-transformer的中文文档',
      body: readFileSync(
        path.join(__dirname, '../../app/_components/mdx/content-test.mdx'),
        'utf8',
      ),
      slug: 'class-validator-he-class-transformer-de-zhong-wen-wen-dang',
      summary: '一篇markdown测试文章',
      keywords: 'nodejs,nestjs,class-validator,class-transformer',
      description: '这是一篇markdown测试文章',
    },
  });
};
