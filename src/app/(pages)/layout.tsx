import type { Metadata } from 'next';
import type { FC, PropsWithChildren, ReactNode } from 'react';

import { Auth } from '../_components/auth/provider';
import './global.css';
import { Footer } from '../_components/layout/footer';
import { Header } from '../_components/layout/header';
import { Toaster } from '../_components/shadcn/ui/toaster';
import Theme from '../_components/theme';
import $styles from './layout.module.css';
export const metadata: Metadata = {
  title: 'yiyue的博客',
  description:
    'yiyue的个人博客,提供一些ts、react、node.js、php、golang相关的技术文档以及分享一些生活琐事',
};

const AppLayout: FC<PropsWithChildren<{ modal: ReactNode }>> = ({ children, modal }) => (
  <Auth>
    <Theme>
      <div className={$styles.layout}>
        <Header />
        {children}
        <Footer />
      </div>
      {modal}
      <Toaster />
    </Theme>
  </Auth>
);
export default AppLayout;
