import type { Metadata, ResolvingMetadata } from 'next';
import type { FC } from 'react';

import { isNil } from 'lodash';
import { notFound, redirect } from 'next/navigation';

import { PostPageForm } from '@/app/_components/post/page-form';
import { fetchApi } from '@/libs/api';
import { checkAccessToken } from '@/libs/token';

import $styles from '../../create/style.module.css';

// 添加动态标记，强制使用 SSR
export const dynamic = 'force-dynamic';

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
  return {
    title: `编辑文章 - ${(await parent).title?.absolute}`,
    description: '文章编辑页面',
  };
};

const PostEditPage: FC<{ params: Promise<{ item: string }> }> = async ({ params }) => {
  const auth = await checkAccessToken();
  if (isNil(auth)) return redirect('/auth/login');
  const { item } = await params;
  const result = await fetchApi(async (c) => c.api.posts.byid[':id'].$get({ param: { id: item } }));
  if (!result.ok) {
    if (result.status !== 404) throw new Error((await result.json()).message);
    return notFound();
  }
  const post = (await result.json()) as any;
  return (
    <div className="tw-page-container">
      <div className={$styles.item}>
        <PostPageForm post={post} />
      </div>
    </div>
  );
};
export default PostEditPage;
