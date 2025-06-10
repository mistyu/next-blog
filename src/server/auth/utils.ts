'use server';
import type { Context } from 'hono';

import jwt from 'jsonwebtoken';
import { isNil } from 'lodash';

import { authConfig } from '@/config/auth';
import { redis } from '@/libs/redis';
import { getTime, localTime } from '@/libs/time';

import type { AuthItem, AuthLoginResponse } from './type';

import { createErrorResult } from '../common/error';
import { passport } from './passport';
import { generateAccessToken, getAccessTokenFromHeader } from './token';

// 存储在redis中的令牌黑名单键名称
const BLACKLIST_KEY = 'token:blacklist';

/**
 * 将token加入黑名单
 * @param token 待加入黑名单的token
 */
export const addTokenToBlacklist = async (token: string): Promise<boolean> => {
  'use server';
  try {
    // 先用decode获取过期时间，不验证签名
    const payload = jwt.decode(token) as any;
    if (isNil(payload?.exp)) return false;

    // 计算剩余时间（秒）
    const timeToExpire = payload.exp - localTime(getTime()).unix();
    if (timeToExpire <= 0) return false; // token已过期，无需加入黑名单

    // 验证token的有效性（签名验证）
    jwt.verify(token, authConfig.jwtSecret);

    // token有效且未过期，加入黑名单
    await redis.set(`${BLACKLIST_KEY}:${token}`, '1', 'EX', timeToExpire);
    return true;
  } catch (error) {
    // token已过期或无效，无需加入黑名单
    if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
      return false;
    }
    throw new Error(error as any);
  }
};

/**
 * 检查token是否在黑名单中
 * @param token 待检查的token
 */
export const isTokenInBlacklist = async (token: string): Promise<boolean> => {
  'use server';
  try {
    const exists = await redis.exists(`${BLACKLIST_KEY}:${token}`);
    return exists === 1;
  } catch (error) {
    throw new Error(error as any);
  }
};

/**
 * 验证jwt token的有效性
 * @param c 上下文
 */
export const verifyJWT = async (c: Context) =>
  new Promise<boolean>((resolve) => {
    passport.authenticate('jwt', { session: false }, async (err: any, user: AuthItem) => {
      if (err || !user) {
        resolve(false);
        return;
      }
      const token = getAccessTokenFromHeader(c.req.raw as any);
      // 检查token是否在黑名单中
      if (token && (await isTokenInBlacklist(token))) {
        resolve(false);
        return;
      }
      // 将用户信息添加到请求中，供后续api处理器使用
      (c.req as any).user = user;
      resolve(true);
    })(c.req.raw, (c.res as any).raw);
  });

export const authLogin = async (req: any, res: any) => {
  return new Promise<AuthLoginResponse>((resolve) => {
    passport.authenticate('local', (err: any, user: AuthItem, _info: any) => {
      if (err) {
        return err.code === 401
          ? resolve(createErrorResult('认证失败', err.message, 401) as any)
          : resolve(createErrorResult('服务器错误', err, 500) as any);
      }
      const token = generateAccessToken(user);
      return resolve({ token, code: 200 });
    })(req, res);
  });
};
