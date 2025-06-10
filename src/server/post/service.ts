'use server';

import type { Prisma } from '@prisma/client';

import { isNil } from 'lodash';

import type { PaginateOptions } from '@/libs/db/types';

import db from '@/libs/db/client';
import { paginateTransform } from '@/libs/db/utils';
import { getRandomInt } from '@/libs/random';

type PostCreateInput = Omit<Prisma.PostCreateInput, 'thumb'>;
type PostUpdateInput = Omit<Prisma.PostUpdateInput, 'thumb'>;

/**
 * 默认的查询文章列表选项
 */
const defaultPostPaginateOptions = { body: true };

/**
 * 查询分页文章列表信息
 * @param options
 */
export const queryPostPaginate = async (options: PaginateOptions = {}) => {
  const { ...rest } = options;
  const where: Prisma.PostWhereInput = {};

  const data = await db.post.paginate({
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    page: 1,
    limit: 8,
    where,
    ...defaultPostPaginateOptions,
    ...rest,
  });

  return paginateTransform(data);
};

/**
 * 根据查询条件获取文章总页数
 * @param limit
 */
export const queryPostTotalPages = async (
  options: Omit<PaginateOptions, 'page'> = {},
): Promise<number> => {
  const data = await queryPostPaginate({ page: 1, ...options });
  return data.meta.totalPages ?? 0;
};
/**
 * 根据id或slug查询文章信息
 * @param arg
 */
export const queryPostItem = async (arg: string) => {
  const item = await db.post.findFirst({
    where: {
      OR: [
        { id: arg },
        {
          slug: arg,
        },
      ],
    },
  });
  if (!isNil(item)) return item;
  return item;
};

/**
 * 根据slug查询文章信息
 * @param slug
 */
export const queryPostItemBySlug = async (slug: string) => {
  const item = await db.post.findUnique({
    where: { slug },
  });
  if (!isNil(item)) {
    return item;
  }
  return item;
};

/**
 * 根据ID查询文章信息
 * @param id
 */
export const queryPostItemById = async (id: string) => {
  const item = await db.post.findUnique({
    where: { id },
  });
  if (!isNil(item)) {
    return item;
  }
  return item;
};

/**
 * 新增文章
 * @param data
 */
export const createPostItem = async (data: PostCreateInput) => {
  const createData: Prisma.PostCreateInput = {
    ...data,
    thumb: `/uploads/thumb/post-${getRandomInt(1, 8)}.png`,
  };

  const item = await db.post.create({
    data: createData,
  });
  if (!isNil(item)) return queryPostItemById(item.id);
  return item;
};

/**
 * 更新文章
 * @param id
 * @param data
 */
export const updatePostItem = async (id: string, data: PostUpdateInput) => {
  const updateData: Prisma.PostUpdateInput = data;
  const item = await db.post.update({
    where: { id },
    data: updateData,
  });

  if (!isNil(item)) return queryPostItemById(item.id);
  return item;
};

/**
 * 删除文章
 * @param id
 */
export const deletePostItem = async (id: string) => {
  const item = await queryPostItemById(id);
  if (!isNil(item)) {
    await db.post.delete({ where: { id } });
    return item;
  }
  return null;
};

/**
 * 通过ID验证slug的唯一性
 * @param id
 */
export const isSlugUnique = async (id?: string) => async (val?: string | null) => {
  if (isNil(val) || !val.length) return true;
  const post = await queryPostItemBySlug(val);
  if (isNil(post) || post.id === id) return true;
  return false;
};
