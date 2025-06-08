import type { FC } from 'react';

import Link from 'next/link';

import $styles from './(pages)/layout.module.css';
import { Header } from './_components/header';
import Theme from './_components/theme';
const NotFoundPage: FC = () => (
  <Theme>
    <div className={$styles.layout}>
      <Header />
      <div className="tw-page-container">
        <div className="tw-page-blank">
          <h2>Not Found</h2>
          <span className="tw-mx-3">|</span>
          <p>
            404错误意味着这个页面已经不存在了,您可以
            <b>
              <Link className="tw-animate-decoration" href="/">
                返回首页
              </Link>
            </b>
          </p>
        </div>
      </div>
    </div>
  </Theme>
);

export default NotFoundPage;
