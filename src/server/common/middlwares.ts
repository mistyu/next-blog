import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

import { verifyJWT } from '../auth/utils';
import { createErrorResult } from './error';
/**
 * 路由JWT验证保护中间件
 */
export const AuthProtected = createMiddleware(async (c, next) => {
  try {
    const isAuthenticated = await verifyJWT(c);
    if (!isAuthenticated) {
      throw new HTTPException(401, {
        res: new Response(JSON.stringify(createErrorResult('用户未认证'))),
      });
    }
    await next();
  } catch (error) {
    throw new HTTPException(500, {
      res: new Response(JSON.stringify(createErrorResult(error as any))),
    });
  }
});
