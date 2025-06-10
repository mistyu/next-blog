import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import { isNil } from 'lodash';

import type { AuthItem } from './type';

import { createHonoApp } from '../common/app';
import { createErrorResult, defaultValidatorErrorHandler } from '../common/error';
import { AuthProtected } from '../common/middlwares';
import {
  createServerErrorResponse,
  createSuccessResponse,
  createUnauthorizedErrorResponse,
  createValidatorErrorResponse,
} from '../common/response';
import { authLoginRequestBodySchema, logoutSchema, profileSchema, tokenSchema } from './schema';
import { getUser } from './service';
import { addTokenToBlacklist, authLogin, verifyJWT } from './utils';

const app = createHonoApp();

export const authTags = ['认证操作'];

export const authPath = '/auth';

export type AuthApiType = typeof authRoutes;

export const authRoutes = app
  .get(
    '/profile',
    describeRoute({
      tags: authTags,
      summary: '获取用户信息',
      description: '无论是否登录，都会返回状态码 200，如果未登录则用户信息返回null',
      responses: {
        ...createSuccessResponse(profileSchema),
        ...createServerErrorResponse(),
      },
    }),
    async (c) => {
      try {
        const isAuthenticated = await verifyJWT(c);
        if (!isAuthenticated) return c.json({ result: false, data: null }, 200);
        const { id } = (c.req as any).user as AuthItem;
        const user = await getUser(id);
        if (isNil(user)) return c.json({ result: false, data: null }, 200);
        return c.json({ result: true, data: user }, 200);
      } catch (error) {
        return c.json(createErrorResult('获取用户失败', error), 500);
      }
    },
  )
  .post(
    '/login',
    describeRoute({
      tags: authTags,
      summary: '用户登录',
      description: '用户登录',
      responses: {
        ...createValidatorErrorResponse(),
        ...createSuccessResponse(tokenSchema),
        ...createUnauthorizedErrorResponse('认证失败'),
        ...createServerErrorResponse(),
      },
    }),
    validator('json', authLoginRequestBodySchema, defaultValidatorErrorHandler),
    async (c) => {
      const body = await c.req.json();
      // 手动构建认证请求
      const authReq = {
        ...c.req.raw,
        body,
      };
      const result = await authLogin(authReq, (c.res as any).raw);
      switch (result.code) {
        case 200:
          return c.json({ token: result.token }, 200);
        default:
          return c.json(result, result.code);
      }
    },
  )
  .post(
    '/logout',
    describeRoute({
      tags: authTags,
      summary: '用户登出',
      description: '用户登出',
      responses: {
        ...createUnauthorizedErrorResponse(),
        ...createSuccessResponse(logoutSchema),
        ...createServerErrorResponse(),
      },
    }),
    AuthProtected,
    async (c) => {
      try {
        const { id } = (c.req as any).user as AuthItem;
        const success = await addTokenToBlacklist(id);
        // 注意：这里直接返回200就行了。因为反正你是退出成功还是token失效，前端都是跳转到登录页，没有什么区别
        if (!success) return c.json(createErrorResult('用户未登录'), 200);
        return c.json({ message: '登出成功' }, 200);
      } catch (error) {
        return c.json(createErrorResult('登出失败', error), 500);
      }
    },
  );
