'use client';
import type { FC } from 'react';

import { useAuth } from '../auth/hooks';
import { PostCreateButton } from '../post/create-button';
import { ShadcnThemeSetting } from '../theme/setting';
import $styles from './tools.module.css';
import { UserAction } from './user';
export const HeaderTools: FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const auth = useAuth();
  return (
    <div className={$styles.tools}>
      <div className="tw-flex">{auth && <PostCreateButton iconBtn={isMobile} />}</div>
      <ShadcnThemeSetting />
      <UserAction iconBtn={isMobile} />
    </div>
  );
};
