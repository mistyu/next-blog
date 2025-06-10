import type { FC } from 'react';

import type { IPaginateQueryProps } from '@/app/_components/paginate/types';

import { BlogIndex } from '@/app/_components/blog/list';

const BlogIndexPage: FC<{
  searchParams: Promise<IPaginateQueryProps & { tag?: string }>;
}> = async ({ searchParams }) => {
  const rest = await searchParams;
  return <BlogIndex {...rest} />;
};

export default BlogIndexPage;
