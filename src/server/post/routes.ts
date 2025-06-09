import { createRoute, z } from '@hono/zod-openapi';

import {
  create201SuccessResponse,
  createBodyRequest,
  createNotFoundErrorResponse,
  createServerErrorResponse,
  createSuccessResponse,
  createUnauthorizedErrorResponse,
  createValidatorErrorResponse,
} from '../common/utils';
import {
  getPostItemRequestSchema,
  postDetailByIdRequestParamsSchema,
  postDetailBySlugRequestParamsSchema,
  postDetailRequestParamsSchema,
  postItemResponseSchema,
  postPageNumbersRequestQuerySchema,
  postPageNumbersResponseSchema,
  postPaginateRequestQuerySchema,
  postPaginateResponseSchema,
} from './schema';

export const postTags = ['文章操作'];

export const postRoutes = {
  paginateRoute: createRoute({
    tags: postTags,
    method: 'get',
    summary: '文章分页查询',
    path: '/',
    request: {
      query: postPaginateRequestQuerySchema,
    },
    responses: {
      ...createSuccessResponse('文章分页查询数据', postPaginateResponseSchema),
      ...createValidatorErrorResponse(),
      ...createServerErrorResponse('查询文章分页数据失败'),
    },
  }),

  pageNumberRoute: createRoute({
    tags: postTags,
    method: 'get',
    summary: '文章页面总数查询',
    path: '/page-numbers',
    request: {
      query: postPageNumbersRequestQuerySchema,
    },
    responses: {
      ...createSuccessResponse('页面总数', postPageNumbersResponseSchema),
      ...createValidatorErrorResponse(),
      ...createServerErrorResponse('查询页面总数失败'),
    },
  }),

  detailRoute: createRoute({
    tags: postTags,
    method: 'get',
    summary: '文章详情查询',
    path: '/:item',
    request: {
      params: postDetailRequestParamsSchema,
    },
    responses: {
      ...createSuccessResponse('查询的文章数据', postItemResponseSchema),
      ...createValidatorErrorResponse(),
      ...createNotFoundErrorResponse('文章不存在'),
      ...createServerErrorResponse('查询文章失败'),
    },
  }),
  detailRouteById: createRoute({
    tags: postTags,
    method: 'get',
    summary: '通过ID查询文章详情',
    path: '/byid/:id',
    request: {
      params: postDetailByIdRequestParamsSchema,
    },
    responses: {
      ...createSuccessResponse('查询的文章数据', postItemResponseSchema),
      ...createValidatorErrorResponse(),
      ...createNotFoundErrorResponse('文章不存在'),
      ...createServerErrorResponse('查询文章失败'),
    },
  }),
  detailRouteBySlug: createRoute({
    tags: postTags,
    method: 'get',
    summary: '通过slug查询文章详情',
    path: '/byslug/:slug',
    request: {
      params: postDetailBySlugRequestParamsSchema,
    },
    responses: {
      ...createSuccessResponse('查询的文章数据', postItemResponseSchema.or(z.null())),
      ...createValidatorErrorResponse(),
      ...createServerErrorResponse('查询文章失败'),
    },
  }),
  createRoute: createRoute({
    tags: postTags,
    method: 'post',
    summary: '创建文章',
    path: '/',
    request: createBodyRequest(getPostItemRequestSchema().openapi('创建的文章数据')),
    responses: {
      ...create201SuccessResponse('创建的文章数据', postItemResponseSchema.or(z.null())),
      ...createValidatorErrorResponse(),
      ...createUnauthorizedErrorResponse('认证失败'),
      ...createServerErrorResponse('创建文章失败'),
    },
  }),
  updateRoute: createRoute({
    tags: postTags,
    method: 'patch',
    summary: '更新文章',
    path: '/:id',
    request: {
      params: postDetailByIdRequestParamsSchema,
      ...createBodyRequest(getPostItemRequestSchema().openapi('文章更新数据')),
    },
    responses: {
      ...createSuccessResponse('更新后的文章数据', postItemResponseSchema.or(z.null())),
      ...createValidatorErrorResponse(),
      ...createUnauthorizedErrorResponse('认证失败'),
      ...createServerErrorResponse('更新文章失败'),
    },
  }),
  deleteRoute: createRoute({
    tags: postTags,
    method: 'delete',
    summary: '删除文章',
    path: '/:id',
    request: {
      params: postDetailByIdRequestParamsSchema,
    },
    responses: {
      ...createSuccessResponse('删除文章结果', postItemResponseSchema.or(z.null())),
      ...createValidatorErrorResponse(),
      ...createUnauthorizedErrorResponse('认证失败'),
      ...createServerErrorResponse('删除文章失败'),
    },
  }),
};
