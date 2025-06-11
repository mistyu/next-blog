import { isNil } from 'lodash';
import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';

import { authSchema } from '../auth/schema';
import { categoryListSchema, categorySchema } from '../category/schema';
import { tagListSchema } from '../tag/schema';

extendZodWithOpenApi(z);

/**
 * 文章查询响应数据结构
 */
export const postSchema = z
  .object({
    id: z.string().openapi({ description: '文章ID' }),
    title: z.string().openapi({ description: '文章标题' }),
    thumb: z.string().openapi({ description: '文章缩略图' }),
    summary: z.string().nullable().optional().openapi({ description: '文章摘要' }),
    keywords: z.string().nullable().optional().openapi({
      description: '文章关键字',
    }),
    description: z.string().nullable().optional().openapi({
      description: '文章描述',
    }),
    slug: z.string().nullable().optional().openapi({ description: '文章slug' }),
    body: z.string().openapi({ description: '文章内容' }),
    createdAt: z.string().openapi({ description: '文章创建时间' }),
    updatedAt: z.string().openapi({ description: '最近更新时间' }),
    author: authSchema.openapi({ description: '文章作者' }),
    tags: tagListSchema.openapi({ description: '关联标签列表' }),
    categories: categoryListSchema.openapi({ description: '关联分类及其祖先分类列表' }),
    category: categorySchema.nullable().openapi({ description: '关联分类' }),
  })
  .strict()
  .openapi({ ref: 'Post', description: '文章详情数据' });

/**
 * 文章分页查询响应数据结构
 */
export const postPaginateSchema = z
  .object({
    items: z.array(postSchema).openapi({ description: '文章列表' }),
    meta: z.object({
      itemCount: z.number().openapi({ description: '当前页文章数量' }),
      totalItems: z.number().optional().openapi({ description: '文章总数量' }),
      perPage: z.number().openapi({ description: '每页文章数量' }),
      totalPages: z.number().optional().openapi({ description: '文章总页数' }),
      currentPage: z.number().openapi({ description: '当前页码' }),
    }),
  })
  .openapi({ ref: 'PostPagniate', description: '文章分页数据' });

/**
 * 文章页面总数查询响应数据结构
 */
export const postPageNumbersSchema = z
  .object({
    result: z.number(),
  })
  .openapi({ ref: 'PostNumbers', description: '文章总页数' });

/**
 * 文章分页查询请求数据结构
 */
export const postPaginateRequestQuerySchema = z.object({
  page: z.coerce.number().optional().openapi({ description: '页码' }),
  limit: z.coerce.number().optional().openapi({ description: '每页数量' }),
  orderBy: z.enum(['asc', 'desc']).optional().openapi({ description: '排序方式' }),
  tag: z.string().optional().openapi({ description: '标签过滤' }),
  category: z.string().optional().openapi({ description: '分类过滤' }),
});

/**
 * 文章页面总数查询请求数据结构
 */
export const postPageNumbersRequestQuerySchema = z.object({
  limit: z.coerce.number().optional().openapi({ description: '每页数量' }),
  tag: z.string().optional().openapi({ description: '标签过滤' }),
  category: z.string().optional().openapi({ description: '分类过滤' }),
});

/**
 * 文章详情查询请求数据结构
 */
export const postDetailRequestParamsSchema = z.object({
  item: z.string().openapi({ description: '文章ID/slug' }),
});

/**
 * 通过ID查询文章详情的请求数据结构
 */
export const postDetailByIdRequestParamsSchema = z.object({
  id: z.string().openapi({ description: '文章ID' }),
});
/**
 * 通过slug查询文章详情的请求数据结构
 */
export const postDetailBySlugRequestParamsSchema = z
  .object({
    slug: z.string(),
  })
  .openapi({ description: '文章slug' });

/**
 * 文章操作(建或更新文章)时的请求数据结构
 * @param slugUniqueValidator Slug唯一性验证结构生成器
 */
export const getPostItemRequestSchema = (
  slugUniqueValidator?: (val?: string | null) => Promise<boolean>,
) => {
  let slug = z
    .string()
    .max(250, {
      message: 'slug不得超过250个字符',
    })
    .nullable()
    .optional()
    .openapi({ description: '文章slug' });
  if (!isNil(slugUniqueValidator)) {
    slug = slug.refine(slugUniqueValidator, {
      message: 'slug必须是唯一的,请重新设置',
    }) as any;
  }
  return z
    .object({
      title: z
        .string()
        .min(1, {
          message: '标题不得少于1个字符',
        })
        .max(200, {
          message: '标题不得超过200个字符',
        })
        .openapi({ description: '文章标题' }),
      summary: z
        .string()
        .max(300, {
          message: '摘要不得超过300个字符',
        })
        .nullable()
        .optional()
        .openapi({ description: '文章摘要' }),
      tags: tagListSchema.optional().openapi({ description: '关联标签列表' }),
      categoryId: z.string().optional().openapi({ description: '关联分类ID' }),
      keywords: z
        .string()
        .max(200, {
          message: '描述不得超过200个字符',
        })
        .nullable()
        .optional()
        .openapi({ description: '文章关键字' }),
      description: z
        .string()
        .max(300, {
          message: '描述不得超过300个字符',
        })
        .nullable()
        .optional()
        .openapi({ description: '文章描述' }),
      slug,
      body: z
        .string()
        .min(1, {
          message: '标题不得少于1个字符',
        })
        .openapi({ description: '文章内容' }),
    })
    .strict();
};
