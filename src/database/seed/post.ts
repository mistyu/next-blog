import type { Prisma } from '@prisma/client';

import { isNil } from 'lodash';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { getRandomInt } from '@/libs/random';
import { generateLowerString } from '@/libs/utils';

import { prisma } from '../client';

type Item = Pick<Prisma.PostCreateInput, 'title' | 'summary'> & {
  bodyPath: string;
  categoryName: string;
  tagNames?: string[];
  authorName: string;
};

const data: Item[] = [
  {
    title: '我的计算机编码起始之路',
    summary: '记录07-13年之间，我学习计算机编程和创业的经历',
    bodyPath: path.join(__dirname, '../fixture/creative/1.md'),
    categoryName: '码农创业记',
    tagNames: ['创业', 'delphi', 'php'],
    authorName: 'yiyue',
  },
  {
    title: '兜兜转转的创业史',
    summary: '记录13-22年之间，我创业和打工的经历',
    bodyPath: path.join(__dirname, '../fixture/creative/2.md'),
    categoryName: '码农创业记',
    tagNames: ['创业', '外包', '融资'],
    authorName: 'yiyue',
  },
];

export const createPostData = async () => {
  for (const post of data) {
    const { title, summary, bodyPath, categoryName, tagNames, authorName } = post;
    const author = await prisma.user.findFirst({
      where: { username: authorName },
    });
    if (!author) {
      throw new Error(`Author ${authorName} not found`);
    }
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (!category) {
      throw new Error(`Category ${categoryName} not found`);
    }
    let tags: Prisma.TagCreateNestedManyWithoutPostsInput | undefined;
    if (!isNil(tagNames)) {
      tags = {
        connectOrCreate: tagNames.map((text) => ({ where: { text }, create: { text } })),
      };
    }
    await prisma.post.create({
      select: { id: true },
      data: {
        thumb: `/uploads/thumb/post-${getRandomInt(1, 8)}.png`,
        title,
        summary,
        body: readFileSync(bodyPath, 'utf8'),
        slug: generateLowerString(title),
        keywords: tagNames?.join(','),
        description: summary,
        author: { connect: { id: author.id } },
        category: {
          connect: {
            id: category.id,
          },
        },
        tags,
      },
    });
  }
};
