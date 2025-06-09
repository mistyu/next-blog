import type { CookieValueTypes } from 'cookies-next';

import { hc } from 'hono/client';
import { isNil } from 'lodash';
import { redirect } from 'next/navigation';

import type { AppType } from '@/server/main';

import { appConfig } from '@/config/app';

import { deleteCookie, getCookie } from './coolkies';
import { ACCESS_TOKEN_COOKIE_NAME } from './token';

/**
 * 获取通用请求头配置
 * 如果有传入getToken参数,则执行getToken函数获取jwt令牌,并在请求头中加上
 * @param getToken
 */
const getHeadersWithAccessToken = (
  getToken?: () => CookieValueTypes | Promise<CookieValueTypes>,
) => {
  return async () => {
    const headers: Record<string, string> = {};
    if (!isNil(getToken)) {
      const token = await getToken();
      if (!isNil(token) && token.length) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    return headers;
  };
};

/**
 * 在服务端组件中创建hono api客户端
 */
const honoApi = hc<AppType>(appConfig.baseUrl, {
  headers: getHeadersWithAccessToken(async () => getCookie(ACCESS_TOKEN_COOKIE_NAME)),
});

/**
 * 在服务端组件中请求hono api
 * @param run
 */
const fetchApi = async <F extends (c: ReturnType<typeof hc<AppType>>) => Promise<any>>(
  run: F,
): Promise<ReturnType<F>> => {
  const result = await run(honoApi);
  if (!result.ok && result.status === 401) {
    if (typeof window === 'undefined') {
      redirect('/auth/login');
    } else {
      await deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
      window.location.href = '/auth/login';
      return new Promise(() => {}); // 防止后续代码执行
    }
  }
  return result;
};

export { fetchApi, honoApi };
