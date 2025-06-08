import type { FC } from 'react';

import { isNil } from 'lodash';
import { notFound } from 'next/navigation';

import { PostPageForm } from '@/app/_components/post/page-form';
import { queryPostItemById } from '@/app/actions/post';

import $styles from '../../create/style.module.css';
import { Metadata, ResolvingMetadata } from 'next';

// 添加动态标记，强制使用 SSR
export const dynamic = 'force-dynamic';

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
    return {
        title: `编辑文章 - ${(await parent).title?.absolute}`,
        description: '文章编辑页面',
    };
};

const PostEditPage: FC<{ params: Promise<{ item: string }> }> = async ({ params }) => {
  const { item } = await params;
  if (isNil(item)) return notFound();
  const post = await queryPostItemById(item);
  if (isNil(post)) return notFound();
  return (
    <div className="tw-page-container">
      <div className={$styles.item}>
        <PostPageForm post={post} />
      </div>
    </div>
  );
};
export default PostEditPage;
