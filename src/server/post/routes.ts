import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import { isNil } from 'lodash';
import { z } from 'zod';

import type { AuthItem } from '../auth/type';

import { createHonoApp } from '../common/app';
import { createErrorResult, defaultValidatorErrorHandler } from '../common/error';
import { AuthProtected } from '../common/middlwares';
import {
  create201SuccessResponse,
  createNotFoundErrorResponse,
  createServerErrorResponse,
  createSuccessResponse,
  createUnauthorizedErrorResponse,
  createValidatorErrorResponse,
} from '../common/response';
import {
  getPostItemRequestSchema,
  postDetailByIdRequestParamsSchema,
  postDetailBySlugRequestParamsSchema,
  postDetailRequestParamsSchema,
  postPageNumbersRequestQuerySchema,
  postPageNumbersSchema,
  postPaginateRequestQuerySchema,
  postPaginateSchema,
  postSchema,
} from './schema';
import {
  createPostItem,
  deletePostItem,
  isSlugUnique,
  queryPostItem,
  queryPostItemById,
  queryPostItemBySlug,
  queryPostPaginate,
  queryPostTotalPages,
  updatePostItem,
} from './service';

const app = createHonoApp();

export const postTags = ['文章操作'];

export const postPath = '/posts';

export type PostApiType = typeof postRoutes;

export const postRoutes = app
  .get(
    '/',
    describeRoute({
      tags: postTags,
      summary: '文章分页查询',
      description: '文章分页查询',
      responses: {
        ...createSuccessResponse(postPaginateSchema),
        ...createValidatorErrorResponse(),
        ...createServerErrorResponse('查询文章分页数据失败'),
      },
    }),
    validator('query', postPaginateRequestQuerySchema, defaultValidatorErrorHandler),
    async (c) => {
      try {
        const query = c.req.valid('query');
        const options = Object.fromEntries(
          Object.entries(query).map(([k, v]) => [k, ['page', 'limit'].includes(k) ? Number(v) : v]),
        );
        const result = await queryPostPaginate(options);
        return c.json(result, 200);
      } catch (error) {
        return c.json(createErrorResult('查询文章分页数据失败', error), 500);
      }
    },
  )
  .get(
    '/page-numbers',
    describeRoute({
      tags: postTags,
      summary: '文章页面总数查询',
      description: '文章页面总数查询',
      responses: {
        ...createSuccessResponse(postPageNumbersSchema),
        ...createValidatorErrorResponse(),
        ...createServerErrorResponse('查询页面总数失败'),
      },
    }),
    validator('query', postPageNumbersRequestQuerySchema, defaultValidatorErrorHandler),
    async (c) => {
      try {
        const query = c.req.valid('query');
        const options = Object.fromEntries(
          Object.entries(query).map(([k, v]) => [k, ['limit'].includes(k) ? Number(v) : v]),
        );
        const result = await queryPostTotalPages(options);
        return c.json({ result }, 200);
      } catch (error) {
        return c.json(createErrorResult('查询页面总数失败', error), 500);
      }
    },
  )
  .get(
    '/:item',
    describeRoute({
      tags: postTags,
      summary: '文章详情查询',
      description: '可以传入文章id或者slug查询文章详情',
      responses: {
        ...createSuccessResponse(postSchema),
        ...createValidatorErrorResponse(),
        ...createNotFoundErrorResponse('文章不存在'),
        ...createServerErrorResponse('查询文章失败'),
      },
    }),
    validator('param', postDetailRequestParamsSchema, defaultValidatorErrorHandler),
    async (c) => {
      try {
        const { item } = c.req.valid('param');
        const result = await queryPostItem(item);
        if (!isNil(result)) return c.json(result, 200);
        return c.json(createErrorResult('文章不存在'), 404);
      } catch (error) {
        return c.json(createErrorResult('查询文章失败', error), 500);
      }
    },
  )
  .get(
    '/byid/:id',
    describeRoute({
      tags: postTags,
      summary: '通过ID查询文章详情',
      description: '通过ID查询文章详情',
      responses: {
        ...createSuccessResponse(postPaginateSchema),
        ...createValidatorErrorResponse(),
        ...createServerErrorResponse('查询文章分页数据失败'),
      },
    }),
    validator('param', postDetailByIdRequestParamsSchema, defaultValidatorErrorHandler),
    async (c) => {
      try {
        const { id } = c.req.valid('param');
        const result = await queryPostItemById(id);
        if (!isNil(result)) return c.json(result, 200);
        return c.json(createErrorResult('文章不存在'), 404);
      } catch (error) {
        return c.json(createErrorResult('查询文章失败', error), 500);
      }
    },
  )
  .get(
    '/byslug/:slug',
    describeRoute({
      tags: postTags,
      summary: '通过slug查询文章详情',
      description: '通过slug查询文章详情',
      responses: {
        ...createSuccessResponse(postPaginateSchema),
        ...createValidatorErrorResponse(),
        ...createServerErrorResponse('查询文章分页数据失败'),
      },
    }),
    validator('param', postDetailBySlugRequestParamsSchema, defaultValidatorErrorHandler),
    async (c) => {
      try {
        const { slug } = c.req.valid('param');
        const result = await queryPostItemBySlug(slug);
        return c.json(result, 200);
      } catch (error) {
        return c.json(createErrorResult('查询文章失败', error), 500);
      }
    },
  )
  .post(
    '/',
    describeRoute({
      security: [{ bearerAuth: [] }],
      tags: postTags,
      summary: '创建文章',
      description: '创建文章',
      responses: {
        ...create201SuccessResponse(postSchema.or(z.null())),
        ...createValidatorErrorResponse(),
        ...createUnauthorizedErrorResponse('认证失败'),
        ...createServerErrorResponse('创建文章失败'),
      },
    }),
    validator('json', getPostItemRequestSchema(), defaultValidatorErrorHandler),
    AuthProtected,
    async (c) => {
      try {
        const schema = getPostItemRequestSchema(await isSlugUnique());
        const validated = await schema.safeParseAsync(await c.req.json());

        if (!validated.success) {
          return c.json(createErrorResult('请求数据验证失败', validated.error.errors), 400);
        }

        const author = (c.req as any).user as AuthItem;
        if (isNil(author)) return c.json(createErrorResult('用户未认证'), 401);
        const result = await createPostItem({
          ...validated.data,
          authorId: author.id,
        });
        return c.json(result, 201);
      } catch (error) {
        return c.json(createErrorResult('创建文章失败', error), 500);
      }
    },
  )
  .patch(
    '/:id',
    describeRoute({
      security: [{ bearerAuth: [] }],
      tags: postTags,
      summary: '更新文章',
      description: '更新文章',
      responses: {
        ...createSuccessResponse(postSchema.or(z.null())),
        ...createValidatorErrorResponse(),
        ...createUnauthorizedErrorResponse('认证失败'),
        ...createServerErrorResponse('更新文章失败'),
      },
    }),
    validator('param', postDetailByIdRequestParamsSchema, defaultValidatorErrorHandler),
    validator('json', getPostItemRequestSchema(), defaultValidatorErrorHandler),
    AuthProtected,
    async (c) => {
      try {
        const params = c.req.valid('param');
        const schema = getPostItemRequestSchema(await isSlugUnique(params.id));
        const validated = await schema.safeParseAsync(await c.req.json());

        if (!validated.success) {
          return c.json(createErrorResult('请求数据验证失败', validated.error.errors), 400);
        }

        const author = (c.req as any).user as AuthItem;
        if (isNil(author)) return c.json(createErrorResult('用户未认证'), 401);

        const result = await updatePostItem(params.id, validated.data);
        return c.json(result, 200);
      } catch (error) {
        return c.json(createErrorResult('更新文章失败', error), 500);
      }
    },
  )
  .delete(
    '/:id',
    describeRoute({
      security: [{ bearerAuth: [] }],
      tags: postTags,
      summary: '删除文章',
      description: '删除文章',
      responses: {
        ...createSuccessResponse(postSchema.or(z.null())),
        ...createValidatorErrorResponse(),
        ...createUnauthorizedErrorResponse('认证失败'),
        ...createServerErrorResponse('删除文章失败'),
      },
    }),
    validator('param', postDetailByIdRequestParamsSchema, defaultValidatorErrorHandler),
    AuthProtected,
    async (c) => {
      try {
        const { id } = c.req.valid('param');
        const result = await deletePostItem(id);
        return c.json(result, 200);
      } catch (error) {
        return c.json(createErrorResult('删除文章失败', error), 500);
      }
    },
  );
