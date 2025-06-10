import { z } from 'zod';
import 'zod-openapi/extend';

/**
 * 登录请求数据结构
 */
export const authLoginRequestBodySchema = z.object({
  credential: z.string().min(1, '用户名或邮箱不能为空').openapi({ description: '用户名或邮箱' }),
  password: z.string().min(8, '密码至少8位').openapi({ description: '用户密码' }),
});

/**
 * 登录响应数据结构
 */
export const tokenSchema = z
  .object({
    token: z.string().openapi({ ref: 'Token', description: 'jwt token' }),
  })
  .openapi({ ref: 'AuthToken', description: '用户登录/获取token响应数据' });

/**
 * 用户数据结构
 */
export const authSchema = z
  .object({
    id: z.string().openapi({ description: '用户id' }),
    username: z.string().openapi({ description: '用户名' }),
    email: z.string().email().openapi({ description: '用户邮箱' }),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi({ ref: 'Auth', description: '用户信息' });

/**
 * 获取用户信息响应数据结构
 */
export const profileSchema = z
  .object({
    result: z.boolean().openapi({ description: '获取用户信息是否成功' }),
    data: authSchema.or(z.null()).openapi({ description: '用户信息' }),
  })
  .openapi({
    ref: 'AuthProfile',
    description: '获取用户信息响应数据',
  });

/**
 * 登出响应数据结构
 */
export const logoutSchema = z
  .object({
    message: z.string(),
  })
  .openapi({ ref: 'AuthLogout', description: '登出响应数据' });
