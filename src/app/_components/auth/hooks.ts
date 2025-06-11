'use client';
import type { DeepNonNullable } from 'utility-types';

import { zodResolver } from '@hookform/resolvers/zod';
import { isNil } from 'lodash';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import type { AuthItem, AuthLoginRequest } from '@/server/auth/type';

import { authApi } from '@/api/auth';
import { deleteCookie } from '@/libs/coolkies';
import { authLoginRequestBodySchema } from '@/server/auth/schema';
import { ACCESS_TOKEN_COOKIE_NAME, setAccessToken } from '@/server/auth/token';

import { useToast } from '../shadcn/hooks/use-toast';
import { checkAuth } from './checking';
import { AuthContext } from './context';

/**
 * 获取认证状态
 */
export const useAuth = () => {
  const { auth } = use(AuthContext);
  return auth;
};

/**
 * 获取认证状态是否已经检查
 */
export const useAuthChecked = () => {
  const { checked } = use(AuthContext);
  return checked;
};

/**
 * 设置认证状态是否已经检查
 */
export const useAuthSetChecked = () => {
  const { setChecked } = use(AuthContext);
  return useCallback((checked: boolean) => setChecked(checked), []);
};
/**
 * 设置认证状态
 */
export const useSetAuth = () => {
  const { setAuth } = use(AuthContext);
  return useCallback((auth: AuthItem | null) => setAuth(auth), []);
};

export const useAuthCheck = () => {
  const auth = useAuth();
  const checked = useAuthChecked();
  const setAuth = useSetAuth();
  const setChecked = useAuthSetChecked();
  const { toast } = useToast();
  useEffect(() => {
    (async () => {
      if (!checked) {
        try {
          const data = await checkAuth();
          setAuth(data);
          setChecked(true);
        } catch (error) {
          toast({
            variant: 'destructive',
            title: '网络连接错误',
            description: `${(error as Error).message}, 请尝试刷新页面`,
          });
        }
      }
    })();
  }, [auth, checked]);
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
    resolver: zodResolver(authLoginRequestBodySchema),
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
  const setChecked = useAuthSetChecked();
  const router = useRouter();
  return useCallback(
    async (data: DeepNonNullable<AuthLoginRequest>) => {
      let status: number = 200;
      setAuthError(null);
      try {
        const res = await authApi.login(data);
        status = res.status;
        if (!res.ok) throw new Error((await res.json()).message);
        const result = await res.json();
        if (!isNil(result.token)) {
          setAccessToken(result.token);
          const auth = await checkAuth();
          if (!isNil(auth)) {
            setAuth(auth);
            router.replace(`/`);
          } else {
            deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
            setAuthError('获取用户信息失败，请重新登录');
          }
          setChecked(false);
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
