import type { AuthItem } from '@/server/auth/type';

/**
 * 用户认证的全局状态类型
 */
export interface AuthContextType {
  auth: AuthItem | null;
  setAuth: (auth: AuthItem | null) => void;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}
