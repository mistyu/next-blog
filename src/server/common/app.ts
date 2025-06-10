import type { Env } from 'hono';
import type { HonoOptions } from 'hono/hono-base';

import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';

import { passportInitialize } from '../auth/passport';

/**
 * 创建Hono应用
 * @param config
 */
export const createHonoApp = <E extends Env>(options: HonoOptions<E> = {}) => {
  const app = new Hono<E>(options);
  app.use(prettyJSON());
  app.use('*', passportInitialize());
  return app;
};
