'use client';

import type { FC } from 'react';

import Link from 'next/link';

import { cn } from '@/app/_components/shadcn/utils';

import $styles from './logo.module.css';

export const HeaderLogo: FC = () => {
  return (
    <div className={cn($styles.logo)}>
      <Link href="https://github.com/mistyu" target="_blank">
        yiyue
      </Link>
    </div>
  );
};
