'use client';

import type { FC, PropsWithChildren } from 'react';

import { useEffect, useMemo, useState } from 'react';

import type { DateToString } from '@/libs/types';
import type { AuthItem } from '@/server/auth/type';

import { checkAccessToken } from '@/libs/token';

import type { AuthContextType } from './types';

import { Spinner } from '../loading/spinner';
import { useToast } from '../shadcn/hooks/use-toast';
import { AuthContext } from './context';

const AuthProvider: FC<PropsWithChildren & { value: AuthContextType }> = ({ children, value }) => {
  return <AuthContext value={value}>{children}</AuthContext>;
};

/**
 *  全局认证状态包装器
 */
export const Auth: FC<PropsWithChildren> = ({ children }) => {
  const { toast } = useToast();
  const [auth, setAuth] = useState<DateToString<AuthItem> | null>(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setChecked(false);
        const data = await checkAccessToken();
        setAuth(data);
      } catch (error) {
        toast({
          title: '网络连接错误',
          description: `${(error as Error).message}, 请尝试刷新页面`,
        });
      }
      setChecked(true);
    })();
  }, []);
  const value: AuthContextType = useMemo(() => ({ auth, setAuth }), [auth]);
  return (
    <AuthProvider value={value}>
      {checked ? (
        children
      ) : (
        <Spinner
          className="tw-rounded-sm tw-bg-white/80 tw-transition-opacity tw-duration-300 dark:tw-bg-black/50"
          icon={false}
        />
      )}
    </AuthProvider>
  );
};
