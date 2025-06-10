import type { FC, JSX, PropsWithChildren } from 'react';

import { isNil } from 'lodash';

import { authApi } from '@/api/auth';
import { checkAccessToken } from '@/server/auth/token';

import { Spinner } from '../loading/spinner';
import { useAuthCheck, useAuthChecked } from './hooks';

const DefaultLoading = () => {
  return (
    <Spinner
      className="tw-rounded-sm tw-bg-white/80 tw-transition-opacity tw-duration-300 dark:tw-bg-black/50"
      icon={false}
    />
  );
};

export const checkAuth = async () =>
  checkAccessToken(async () => {
    const res = await authApi.profile();
    if (!res.ok) return null;
    const { result, data } = await res.json();
    if (!result || isNil(data)) return null;
    return data;
  });

export const AuthProtector: FC<PropsWithChildren<{ loading?: JSX.Element }>> = (props) => {
  const { loading = <DefaultLoading />, children } = props;
  const checked = useAuthChecked();
  useAuthCheck();
  return !checked ? loading : children;
};
