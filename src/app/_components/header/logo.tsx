import type { FC } from 'react';

import { cn } from '../shadcn/utils';
import $styles from './logo.module.css';

export const HeaderLogo: FC = () => {
  return <div className={cn($styles.logo)}>yiyue</div>;
};
