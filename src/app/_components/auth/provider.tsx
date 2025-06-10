'use client';

import type { FC, PropsWithChildren } from 'react';

import { useMemo, useState } from 'react';

import type { AuthItem } from '@/server/auth/type';

import type { AuthContextType } from './types';

import { AuthContext } from './context';

const AuthProvider: FC<PropsWithChildren & { value: AuthContextType }> = ({ children, value }) => {
  return <AuthContext value={value}>{children}</AuthContext>;
};

/**
 *  全局认证状态包装器
 */
export const Auth: FC<PropsWithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<AuthItem | null>(null);
  const [checked, setChecked] = useState(false);
  const value: AuthContextType = useMemo(
    () => ({ auth, setAuth, checked, setChecked }),
    [auth, checked],
  );
  return <AuthProvider value={value}>{children}</AuthProvider>;
};
