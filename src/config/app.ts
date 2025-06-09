import type { AppConfig } from '@/libs/types';
export const appConfig: AppConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
  locale: 'zh-cn',
  timezone: 'Asia/Shanghai',
};
