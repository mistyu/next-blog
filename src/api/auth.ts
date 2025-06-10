import type { AuthApiType } from '@/server/auth/routes';
import type { AuthLoginRequest } from '@/server/auth/type';

import { buildClient, fetchApi } from '@/libs/hono';
import { authPath } from '@/server/auth/routes';
export const authClient = buildClient<AuthApiType>(authPath);
export const authApi = {
  profile: async () => fetchApi(authClient, async (c) => c.profile.$get()),
  login: async (data: AuthLoginRequest) =>
    fetchApi(authClient, async (c) =>
      c.login.$post({
        json: data,
      }),
    ),
  logout: async () => fetchApi(authClient, async (c) => c.logout.$post()),
};
