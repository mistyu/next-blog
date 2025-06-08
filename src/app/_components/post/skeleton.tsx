import type { FC } from 'react';

import { Skeleton } from '../shadcn/ui/skeleton';

/**
 * 通用骨架屏
 */
const PageSkeleton: FC = () => (
  <div className="tw-w-full tw-justify-center tw-space-y-7">
    <div className="tw-flex tw-flex-col tw-space-y-3">
      <Skeleton className="tw-h-52 tw-w-full" />
      <div className="tw-flex tw-h-16 tw-w-full tw-justify-between tw-space-x-20">
        <Skeleton className="tw-w-1/3 tw-flex-none tw-bg-gray-950/30 tw-backdrop-blur-sm" />
        <Skeleton className="tw-flex-auto  tw-bg-gray-950/30 tw-backdrop-blur-sm" />
      </div>
    </div>
    <div className="tw-flex tw-flex-col tw-space-y-5">
      <Skeleton className="tw-h-52 tw-w-full tw-backdrop-blur-md" />
      <div className="tw-flex tw-h-16 tw-w-full tw-justify-between tw-space-x-20">
        <Skeleton className="tw-w-1/3 tw-flex-none tw-bg-gray-950/30 tw-backdrop-blur-sm" />
        <Skeleton className="tw-flex-auto tw-bg-gray-950/30 tw-backdrop-blur-sm" />
      </div>
    </div>
  </div>
);

/**
 * 文章内容骨架屏
 */
const PostContentSkeleton: FC = () => (
  <div className="tw-flex tw-size-full tw-flex-auto tw-justify-between tw-space-x-2">
    <Skeleton className="tw-w-auto tw-flex-auto tw-bg-gray-950/30 tw-backdrop-blur-sm" />
    <Skeleton className="tw-hidden tw-bg-gray-950/30 tw-backdrop-blur-sm lg:tw-flex lg:tw-w-56" />
  </div>
);

export { PageSkeleton, PostContentSkeleton };
