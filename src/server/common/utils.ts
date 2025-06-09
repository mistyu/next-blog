import type { Hook, z } from '@hono/zod-openapi';
import type { Context, Env } from 'hono';

import { OpenAPIHono } from '@hono/zod-openapi';
import { prettyJSON } from 'hono/pretty-json';
import { isNil } from 'lodash';

import type { HonoAppCreateOptions } from './type';

import { errorSchema } from './schema';

/**
 * 创建Hono应用
 * @param config
 */
export const createHonoApp = <E extends Env>(config: HonoAppCreateOptions<E> = {}) => {
  const options: Omit<HonoAppCreateOptions<E>, 'defaultHook'> & {
    defaultHook?: Hook<any, E, any, any>;
  } = {};
  if (config.defaultHook !== false) {
    options.defaultHook = config.defaultHook ?? defaultValidatorErrorHandler;
  }
  const app = new OpenAPIHono<E>(options);
  app.use(prettyJSON());
  return app;
};

/**
 * 异常响应生成
 * @param title
 * @param error
 * @param code
 */
export const createErrorResult = (title: string, error?: any, code?: number) => {
  let message = title;
  if (!isNil(error)) {
    message =
      error instanceof Error || 'message' in error
        ? `${title}:${error.message}`
        : `${title}:${error.toString()}`;
  }

  return {
    code,
    message,
  };
};

/**
 * 请求数据验证失败的默认响应
 * @param result
 * @param c
 */
export const defaultValidatorErrorHandler = (result: any, c: Context) => {
  if (!result.success) {
    return c.json(
      {
        ...createErrorResult('请求数据验证失败', 400),
        errors: result.error.format(),
      },
      400,
    );
  }
  return result;
};

/**
 * 创建body请求体数据结构
 * @param schema
 */
export const createBodyRequest = <T>(schema: z.ZodSchema<T>) => {
  return {
    body: { content: { 'application/json': { schema } } },
  };
};

/**
 * 创建OpenAPI响应信息
 * @param description
 * @param schema
 */
export const createResponse = <T, S extends number>(
  description: string,
  schema: z.ZodSchema<T>,
  status: S,
) => {
  return { [status]: { description, content: { 'application/json': { schema } } } } as {
    [K in S]: {
      description: string;
      content: { 'application/json': { schema: z.ZodSchema<T> } };
    };
  };
};

/**
 * 创建OpenAPI成功响应信息
 * @param description
 * @param schema
 */
export const createSuccessResponse = <T>(description: string, schema: z.ZodSchema<T>) => {
  return createResponse(description ?? '请求成功', schema, 200);
};

/**
 * 创建OpenAPI 201 成功响应信息
 * @param description
 * @param schema
 */
export const create201SuccessResponse = <T>(description: string, schema: z.ZodSchema<T>) => {
  return createResponse(description ?? '请求成功', schema, 201);
};

/**
 * 创建OpenAPI异常响应信息
 * @param description
 */
export const createErrorResponse = <S extends number>(description: string, status: S) => {
  return {
    [status]: { description, content: { 'application/json': { schema: errorSchema } } },
  } as {
    [K in S]: {
      description: string;
      content: { 'application/json': { schema: typeof errorSchema } };
    };
  };
};

/**
 * 创建请求数据验证失败的响应信息
 * @param description
 */
export const createValidatorErrorResponse = (description?: string) => {
  return createErrorResponse(description ?? '请求数据验证失败', 400);
};

/**
 * 创建服务器错误响应信息
 * @param description
 */
export const createServerErrorResponse = (description?: string) => {
  return createErrorResponse(description ?? '服务器错误', 500);
};

/**
 * 创建数据不存在响应信息
 * @param description
 */
export const createNotFoundErrorResponse = (description?: string) => {
  return createErrorResponse(description ?? '数据不存在', 404);
};
