import { faker } from '@/libs/db/utils';
import { hashPassword } from '@/libs/passwd';

import { prisma } from '../client';

export const createUserData = async () => {
  await prisma.user.$truncate();
  await prisma.user.create({
    select: { id: true },
    data: {
      username: 'yiyue',
      password: hashPassword('12345678aA$'),
      email: 'lichenhui821@qq.com',
    },
  });
  for (let index = 0; index < 12; index++) {
    await prisma.user.create({
      select: { id: true },
      data: {
        username: faker.internet.username(),
        password: hashPassword(faker.internet.password()),
        email: faker.internet.email(),
      },
    });
  }
};
