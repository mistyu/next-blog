import type { Metadata, ResolvingMetadata } from 'next';
import type { FC } from 'react';

import { isNil } from 'lodash';
import { redirect } from 'next/navigation';

import { PostPageForm } from '@/app/_components/post/page-form';
import { checkAccessToken } from '@/libs/token';

import $styles from './style.module.css';

// 添加动态标记，强制使用 SSR
export const dynamic = 'force-dynamic';
// export const fetchCache = 'force-no-store';

export const generateMetadata = async (_: any, parent: ResolvingMetadata): Promise<Metadata> => {
  return {
    title: `创建文章 - ${(await parent).title?.absolute}`,
    description: '文章创建页面',
  };
};

const PostCreatePage: FC = async () => {
  const auth = await checkAccessToken();
  if (isNil(auth)) return redirect('/auth/login');
  return (
    <div className="tw-page-container">
      <div className={$styles.item}>
        <PostPageForm />
      </div>
    </div>
  );
};
export default PostCreatePage;
