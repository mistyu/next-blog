import type { FC } from 'react';

import Link from 'next/link';

const NotFoundPage: FC = () => (
  <div className="tw-page-item">
    <div className="tw-page-blank tw-page-container">
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
);

export default NotFoundPage;
