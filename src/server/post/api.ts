import { isNil } from 'lodash';

import { createErrorResult, createHonoApp } from '../common/utils';
import { postRoutes } from './routes';
import { getPostItemRequestSchema } from './schema';
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
export const postApi = app
  .openapi(postRoutes.paginateRoute, async (c) => {
    try {
      const query = c.req.valid('query');
      const options = Object.fromEntries(Object.entries(query).map(([k, v]) => [k, Number(v)]));
      const result = await queryPostPaginate(options);
      return c.json(result, 200);
    } catch (error) {
      return c.json(createErrorResult('查询文章分页数据失败', error), 500);
    }
  })
  .openapi(postRoutes.pageNumberRoute, async (c) => {
    try {
      const query = c.req.valid('query');
      const limit = query.limit ? Number(query.limit) : undefined;
      const result = await queryPostTotalPages(limit);
      return c.json({ result }, 200);
    } catch (error) {
      return c.json(createErrorResult('查询页面总数失败', error), 500);
    }
  })
  .openapi(postRoutes.detailRoute, async (c) => {
    try {
      const { item } = c.req.valid('param');
      const result = await queryPostItem(item);
      if (!isNil(result)) return c.json(result, 200);
      return c.json(createErrorResult('文章不存在'), 404);
    } catch (error) {
      return c.json(createErrorResult('查询文章失败', error), 500);
    }
  })
  .openapi(postRoutes.detailRouteById, async (c) => {
    try {
      const { id } = c.req.valid('param');
      const result = await queryPostItemById(id);
      if (!isNil(result)) return c.json(result, 200);
      return c.json(createErrorResult('文章不存在'), 404);
    } catch (error) {
      return c.json(createErrorResult('查询文章失败', error), 500);
    }
  })
  .openapi(postRoutes.detailRouteBySlug, async (c) => {
    try {
      const { slug } = c.req.valid('param');
      const result = await queryPostItemBySlug(slug);
      return c.json(result, 200);
    } catch (error) {
      return c.json(createErrorResult('查询文章失败', error), 500);
    }
  })
  .openapi(postRoutes.createRoute, async (c) => {
    try {
      const schema = getPostItemRequestSchema(await isSlugUnique());
      const validated = await schema.safeParseAsync(await c.req.json());

      if (!validated.success) {
        return c.json(createErrorResult('请求数据验证失败', validated.error.errors), 400);
      }
      const result = await createPostItem(validated.data);
      return c.json(result, 201);
    } catch (error) {
      return c.json(createErrorResult('创建文章失败', error), 500);
    }
  })
  .openapi(postRoutes.updateRoute, async (c) => {
    try {
      const params = c.req.valid('param');
      const schema = getPostItemRequestSchema(await isSlugUnique(params.id));
      const validated = await schema.safeParseAsync(await c.req.json());

      if (!validated.success) {
        return c.json(createErrorResult('请求数据验证失败', validated.error.errors), 400);
      }
      const result = await updatePostItem(params.id, validated.data);
      return c.json(result, 200);
    } catch (error) {
      return c.json(createErrorResult('更新文章失败', error), 500);
    }
  })
  .openapi(postRoutes.deleteRoute, async (c) => {
    try {
      const { id } = c.req.valid('param');
      const result = await deletePostItem(id);
      return c.json(result, 200);
    } catch (error) {
      return c.json(createErrorResult('删除文章失败', error), 500);
    }
  });
