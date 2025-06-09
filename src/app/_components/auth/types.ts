import type { DateToString } from '@/libs/types';
import type { AuthItem } from '@/server/auth/type';

/**
 * 用户认证的全局状态类型
 */
export interface AuthContextType {
  auth: DateToString<AuthItem> | null;
  setAuth: (auth: DateToString<AuthItem> | null) => void;
}
