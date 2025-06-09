'use client';

import type { DeepNonNullable } from 'utility-types';

import { zodResolver } from '@hookform/resolvers/zod';
import { isNil } from 'lodash';
import { useRouter } from 'next/navigation';
import { useCallback, useContext } from 'react';
import { useForm } from 'react-hook-form';

import type { DateToString } from '@/libs/types';
import type { AuthItem, AuthLoginRequest } from '@/server/auth/type';

import { fetchApi } from '@/libs/api';
import { deleteCookie } from '@/libs/coolkies';
import { ACCESS_TOKEN_COOKIE_NAME, checkAccessToken, setAccessToken } from '@/libs/token';
import { authLoginRequestSchema } from '@/server/auth/schema';

import { useToast } from '../shadcn/hooks/use-toast';
import { AuthContext } from './context';

/**
 * 获取认证状态
 */
export const useAuth = () => {
  const { auth } = useContext(AuthContext);
  return auth;
};

/**
 * 设置认证状态
 */
export const useSetAuth = () => {
  const { setAuth } = useContext(AuthContext);
  return useCallback((auth: DateToString<AuthItem> | null) => setAuth(auth), []);
};

/**
 * 创建登录表单
 */
export const useAuthLoginForm = () => {
  const defaultValues = {
    credential: '',
    password: '',
  } as DeepNonNullable<AuthLoginRequest>;
  return useForm<AuthLoginRequest>({
    mode: 'all',
    resolver: zodResolver(authLoginRequestSchema),
    defaultValues,
  });
};

/**
 * 创建登录提交处理器
 * @param setAuthError
 */
export const useAuthLoginSubmitHandler = (setAuthError: (error: string | null) => void) => {
  const { toast } = useToast();
  const setAuth = useSetAuth();
  const router = useRouter();
  return useCallback(
    async (data: DeepNonNullable<AuthLoginRequest>) => {
      let status: number = 200;
      setAuthError(null);
      try {
        const res = await fetchApi(async (c) =>
          c.api.auth.login.$post({
            json: data,
          }),
        );
        status = res.status;
        if (!res.ok) throw new Error((await res.json()).message);
        const result = await res.json();
        if (!isNil(result.token)) {
          setAccessToken(result.token);
          const auth = await checkAccessToken();
          if (!isNil(auth)) {
            setAuth(auth);
            router.replace(`/`);
          } else {
            deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
            setAuthError('获取用户信息失败，请重新登录');
          }
        }
      } catch (error) {
        if (status === 401) {
          setAuthError((error as Error).message);
        }
        toast({
          variant: 'destructive',
          title: '服务器错误',
          description: (error as Error).message,
        });
      }
    },
    [setAuthError],
  );
};
