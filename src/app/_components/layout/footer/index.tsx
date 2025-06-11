import type { FC } from 'react';

import Link from 'next/link';

export const Footer: FC = () => {
  return (
    <footer className="tw-flex tw-w-full tw-flex-none tw-justify-center tw-self-end  tw-border-t tw-bg-white/30 tw-py-3 dark:tw-bg-black/30">
      <div className="tw-page-container tw-mb-0 tw-flex tw-h-auto tw-flex-col tw-items-center tw-justify-between tw-space-y-4 lg:tw-flex-row lg:tw-space-y-0">
        <div className="tw-flex tw-flex-col tw-items-center tw-space-x-0 tw-space-y-2 lg:tw-flex-row lg:tw-space-x-2 lg:tw-space-y-0">
          <span>© {new Date().getFullYear()} yiyue. All rights reserved.</span>
          <Link
            href="#"
            className="tw-text-muted-foreground tw-transition-colors hover:tw-text-foreground"
          >
            赣ICP备2022011372号-1
          </Link>
          <Link
            href="#"
            className="tw-text-muted-foreground tw-transition-colors hover:tw-text-foreground"
          >
            赣ICP备2022011372号
          </Link>
        </div>
        <div>
          <span>
            Powered by
            <Link
              href="https://nextjs.org/"
              className="tw-mx-2 tw-font-semibold tw-transition-colors hover:tw-text-gray-900"
              target="_blank"
            >
              next.js
            </Link>
            &&
            <Link
              href="https://hono.dev/"
              className="tw-ml-2 tw-font-semibold tw-transition-colors hover:tw-text-gray-900"
              target="_blank"
            >
              hono
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};
