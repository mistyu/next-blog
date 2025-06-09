import { createRoute } from '@hono/zod-openapi';

import {
  createBodyRequest,
  createServerErrorResponse,
  createSuccessResponse,
  createUnauthorizedErrorResponse,
  createValidatorErrorResponse,
} from '../common/utils';
import {
  authLoginRequestSchema,
  authLoginResponseSchema,
  authLogoutResponseSchema,
  authProfileResponseSchema,
} from './schema';

export const authTags = ['认证操作'];

export const authRoutes = {
  // 获取用户信息
  profileRoute: createRoute({
    tags: authTags,
    method: 'get',
    summary: '获取用户信息',
    path: '/profile',
    responses: {
      ...createSuccessResponse(
        '获取成功',
        authProfileResponseSchema.openapi('获取用户信息响应数据'),
      ),
      ...createServerErrorResponse(),
    },
  }),
  // 用户登录
  loginRoute: createRoute({
    tags: authTags,
    method: 'post',
    summary: '用户登录',
    path: '/login',
    request: createBodyRequest(authLoginRequestSchema.openapi('登录请求数据')),
    responses: {
      ...createValidatorErrorResponse(),
      ...createSuccessResponse('登录成功', authLoginResponseSchema),
      ...createUnauthorizedErrorResponse('认证失败'),
      ...createServerErrorResponse(),
    },
  }),
  logoutRoute: createRoute({
    tags: authTags,
    method: 'post',
    summary: '用户登出',
    path: '/logout',
    responses: {
      ...createUnauthorizedErrorResponse(),
      ...createSuccessResponse('登出成功', authLogoutResponseSchema.openapi('登出响应数据')),
      ...createServerErrorResponse(),
    },
  }),
};
