import type { FC } from 'react';

import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

import { postApi } from '@/api/post';

import type { IPaginateQueryProps } from '../../paginate/types';

import { cn } from '../../shadcn/utils';
import { BlogBreadCrumb } from '../breadcrumb';
import { BlogIndexSkeleton } from '../skeleton';
import { getCategories, getNestLinks } from '../utils';
import { PostList } from './items';
import { PostListPaginate } from './paginate';
import { Sidebar } from './sidebar';
import $styles from './style.module.css';
export interface BlogIndexProps extends IPaginateQueryProps {
  tag?: string;
  categories?: string[];
}
export const BlogIndex: FC<BlogIndexProps> = async (props) => {
  const { page, limit = 8, tag, categories } = props ?? {};
  const categoryItems = await getCategories(categories);
  if (!categoryItems) return notFound();
  const category = categoryItems.length > 0 ? categoryItems[categoryItems.length - 1] : undefined;
  const breandcrumbs = getNestLinks(categoryItems);
  const result = await postApi.paginate({ page, limit, tag, category: category?.id });
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
            <div className="tw-w-full tw-flex-none">
              <BlogBreadCrumb items={breandcrumbs} tag={tag} basePath="/blog" />
            </div>
            <PostList items={items} activeTag={tag} />
            {meta.totalPages! > 1 && (
              <PostListPaginate limit={limit} page={meta.currentPage} tag={tag} />
            )}
          </div>
          <Sidebar activedCategories={categoryItems} activedTag={tag} />
        </div>
      </Suspense>
    </div>
  );
};
