import type { Context, Next } from 'hono';

import { isNil } from 'lodash';
import { Passport } from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import { authConfig } from '@/config/auth';

import type { AuthItem } from './type';

import { validateUser } from './service';
import { getAccessTokenFromHeader } from './token';

// 存储在redis中的令牌黑名单键名称
// const BLACKLIST_KEY = 'token:blacklist';
export const passport = new Passport();
/**
 * 初始化passport中间件
 */
export const passportInitialize = () => async (c: Context, next: Next) => {
  const handler = passport.initialize();
  await new Promise((resolve) => {
    handler(c.req.raw as any, (c.res as any).raw, resolve as any);
  });
  await next();
};

/**
 * 添加本地用户认证策略
 */
passport.use(
  'local',
  new LocalStrategy({ usernameField: 'credential' }, async (credential, password, done) => {
    try {
      const user = await validateUser(credential, password);
      if (typeof user === 'boolean' && !user) done({ message: '密码错误', code: 401 });
      if (isNil(user)) done({ message: '用户不存在', code: 401 });
      done(null, user as any);
    } catch (error) {
      done(error);
    }
  }),
);
/**
 * 添加jwt验证策略
 */
passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: getAccessTokenFromHeader,
      secretOrKey: authConfig.jwtSecret,
    },
    async (jwtPayload: AuthItem, done: any) => {
      try {
        return done(null, jwtPayload);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);
