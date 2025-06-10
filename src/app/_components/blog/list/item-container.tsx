/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';
import type { FC, PropsWithChildren } from 'react';

import { useRouter } from 'next/navigation';

import { cn } from '../../shadcn/utils';
import $styles from './style.module.css';
export const ItemContainer: FC<PropsWithChildren<{ url?: string }>> = ({ children, url }) => {
  const router = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    url && router.push(url);
  };
  return (
    <div
      className={cn($styles.content, 'tw-page-block hover:tw-page-block-hover tw-cursor-pointer')}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
