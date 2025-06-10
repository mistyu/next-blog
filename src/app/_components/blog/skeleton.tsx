import type { FC } from 'react';

import { Skeleton } from '../shadcn/ui/skeleton';

/**
 * 文章列表页骨架屏
 */
const BlogIndexSkeleton: FC = () => (
  <div className="tw-page-container tw-flex tw-w-full tw-flex-auto tw-flex-col lg:tw-flex-row lg:tw-space-x-4">
    <div className="tw-order-2 tw-flex tw-flex-auto tw-flex-col tw-space-y-5 lg:tw-order-1">
      <div className="tw-w-full tw-flex-none">
        <Skeleton className="tw-flex tw-h-9 tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-bg-gray-950/30 tw-px-3 tw-shadow-sm tw-backdrop-blur-sm" />
      </div>
      <div className="tw-flex tw-w-full tw-flex-auto tw-flex-col tw-space-y-4">
        <Skeleton className="tw-w-full tw-flex-auto tw-bg-gray-950/30 tw-backdrop-blur-sm" />
        <Skeleton className="tw-w-full tw-flex-auto tw-bg-gray-950/30 tw-backdrop-blur-sm" />
        <Skeleton className="tw-w-full tw-flex-auto tw-bg-gray-950/30 tw-backdrop-blur-sm" />
      </div>
    </div>
    <div className="tw-order-1 tw-mb-6 tw-flex tw-w-full tw-flex-none tw-flex-col lg:tw-order-2 lg:tw-mb-0 lg:tw-w-72">
      <Skeleton className="tw-h-24 tw-w-full tw-backdrop-blur-md lg:tw-h-1/2 " />
    </div>
  </div>
);

/**
 * 文章详情页骨架屏
 */
const PostItemSkeleton: FC = () => (
  <div className="tw-page-container tw-flex tw-w-full tw-flex-auto tw-flex-col">
    <div className="tw-order-2 tw-flex tw-flex-auto tw-flex-col tw-space-y-5">
      <div className="tw-w-full tw-flex-none">
        <Skeleton className="tw-flex tw-h-9 tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-bg-gray-950/30 tw-px-3 tw-shadow-sm tw-backdrop-blur-sm" />
      </div>
      <div className="tw-flex tw-w-full tw-flex-auto tw-flex-col tw-space-y-4">
        <Skeleton className="tw-w-full tw-flex-auto tw-bg-gray-950/30 tw-backdrop-blur-sm" />
      </div>
    </div>
  </div>
);

/**
 * 文章内容骨架屏
 */
const PostContentSkeleton: FC = () => (
  <div className="tw-relative tw-flex tw-size-full tw-flex-auto tw-justify-between tw-gap-8 tw-space-x-2">
    <Skeleton className="tw-w-auto tw-flex-auto tw-bg-gray-950/30 tw-backdrop-blur-sm" />
    <Skeleton className="tw-hidden tw-bg-gray-950/30 tw-backdrop-blur-sm lg:tw-flex lg:tw-w-56" />
  </div>
);

export { BlogIndexSkeleton, PostContentSkeleton, PostItemSkeleton };
