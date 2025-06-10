import type { SerializeOptions as CookieSerializeOptions } from 'cookie';
import type { DurationUnitsObjectType } from 'dayjs/plugin/duration';

import jwt from 'jsonwebtoken';
import { isNil, isNumber, omit } from 'lodash';

import type { AuthItem } from '@/server/auth/type';

import { authConfig } from '@/config/auth';
import { deleteCookie, setCookie } from '@/libs/coolkies';
import { getDayjs, getTime, localTime } from '@/libs/time';

type AccessTokenCookieOptions = Pick<
  CookieSerializeOptions,
  'domain' | 'path' | 'secure' | 'sameSite' | 'partitioned' | 'maxAge' | 'httpOnly'
> & {
  name: string;
  value: string;
};
// 存储在cookies中的令牌键名称
export const ACCESS_TOKEN_COOKIE_NAME = 'auth_token';

/**
 * 生成jwt token
 * @param user 用户信息
 */
export const generateAccessToken = (user: AuthItem) => {
  const tokenExpiry: DurationUnitsObjectType = isNumber(authConfig.tokenExpiry)
    ? { seconds: authConfig.tokenExpiry }
    : authConfig.tokenExpiry;
  // 使用ms解析token有效时间
  const expiryMs = getDayjs().duration(tokenExpiry).asMilliseconds();
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      // 当前时间+token有效时间 = 过期时间
      exp: localTime(getTime().add(expiryMs, 'millisecond')).unix(),
    },
    authConfig.jwtSecret,
  );
};

/**
 * 根据token获取过期时间
 * @param token
 */
const getTokenExpirationTime = (token: string): number => {
  const payload = jwt.decode(token) as any;
  if (!isNil(payload?.exp)) {
    const expiresIn = Number(payload.exp) - Math.floor(Date.now() / 1000);
    if (expiresIn <= 0) {
      throw new Error('令牌已过期');
    }
    return expiresIn;
  }
  throw new Error('令牌解析错误');
};

/**
 * 获取access token的cookie选项
 * @param token
 */
const getAccessTokenOptions = (token: string): AccessTokenCookieOptions => {
  const maxAge = getTokenExpirationTime(token);
  return {
    name: ACCESS_TOKEN_COOKIE_NAME,
    value: token,
    maxAge,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  };
};

/**
 * 在cookies设置access token
 * @param token
 */
export const setAccessToken = async (token: string) => {
  const options = getAccessTokenOptions(token);
  await setCookie(options.name, token, omit(getAccessTokenOptions(token), ['name', 'value']));
};

/**
 * 从请求头中获取token
 * @param req 请求
 */
export const getAccessTokenFromHeader = (req: any): string | null => {
  const authHeader = req.headers.get?.('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

/**
 * 检测token的有效性(当前用户是否已登录)
 */
export const checkAccessToken = async (func: () => Promise<AuthItem | null>) => {
  try {
    const result = await func();
    if (isNil(result)) await deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
    return result;
    // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (error: any) {
    // 服务器错误，删除access token
    await deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
    throw new Error('检测用户信息失败');
  }
};
