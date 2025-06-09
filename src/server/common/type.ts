import type { Hook } from '@hono/zod-openapi';
import type { Env } from 'hono';

export interface HonoAppCreateOptions<E extends Env> {
  /**
   * 默认的错误处理器
   */
  defaultHook?: Hook<any, E, any, any> | false;
}
