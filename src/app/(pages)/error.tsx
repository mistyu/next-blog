'use client';

import type { FC, MouseEventHandler } from 'react';

import Link from 'next/link';
import { useCallback } from 'react';

const ErrorBoundaryPage: FC<{ error: Error & { digest?: string }; reset: () => void }> = ({
  error,
  reset,
}) => {
  const resetPage = useCallback<MouseEventHandler<HTMLAnchorElement>>((e) => {
    e.preventDefault();
    reset();
  }, []);
  return (
    <div className="tw-page-item">
      <div className="tw-page-blank tw-page-container tw-flex tw-flex-col tw-space-y-4">
        <h2>糟糕!服务器挂了...</h2>
        <p>
          错误信息: {error.message} |
          <b className="tw-ml-3">
            <Link className="tw-animate-decoration" passHref href="#" onClick={resetPage}>
              点此重试
            </Link>
          </b>
        </p>
        <small className="tw-px-3">
          如果是你自己的网络问题,修复后可.如果不是,请尽快联系管理员处理,十分感谢！
        </small>
      </div>
    </div>
  );
};
export default ErrorBoundaryPage;
