import type { FC } from 'react';

import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { postApi } from '@/api/post';

import type { IPaginateQueryProps } from '../../paginate/types';

import { cn } from '../../shadcn/utils';
import { BlogIndexSkeleton } from '../skeleton';
import { PostList } from './items';
import { PostListPaginate } from './paginate';
import $styles from './style.module.css';
export interface BlogIndexProps extends IPaginateQueryProps {}
export const BlogIndex: FC<BlogIndexProps> = async (props) => {
  const { page, limit = 8 } = props ?? {};
  const result = await postApi.paginate({ page, limit });
  if (!result.ok) throw new Error((await result.json()).message);
  const { items, meta } = await result.json();
  if (meta.totalPages && meta.totalPages > 0 && meta.currentPage > meta.totalPages) {
    return redirect('/');
  }
  return (
    <div className="tw-page-item">
      <Suspense fallback={<BlogIndexSkeleton />}>
        <div className={cn('tw-page-container', $styles.blogIndex)}>
          <div className={$styles.container}>
            <PostList items={items} />
            {meta.totalPages! > 1 && <PostListPaginate limit={limit} page={meta.currentPage} />}
          </div>
        </div>
      </Suspense>
    </div>
  );
};
