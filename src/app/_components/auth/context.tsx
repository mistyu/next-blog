import { createContext } from 'react';

import type { AuthItem } from '@/server/auth/type';

import type { AuthContextType } from './types';

/**
 * 用户认证的全局状态Context
 */
export const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: (_: AuthItem | null) => {},
  checked: false,
  setChecked: (_: boolean) => {},
});
