import type { Metadata } from 'next';
import type { FC } from 'react';

import type { IPostMetadata } from '@/app/_components/blog/metadata';

import { PostItemIndex } from '@/app/_components/blog/item';
import { getPostItemMetadata } from '@/app/_components/blog/metadata';

export const generateMetadata = async (
  { params }: Omit<IPostMetadata, 'parent'>,
  parent: IPostMetadata['parent'],
): Promise<Metadata> => getPostItemMetadata({ params, parent });

const PostItemPage: FC<{ params: Promise<{ item: string }> }> = async ({ params }) => {
  const { item } = await params;
  return <PostItemIndex item={item} />;
};

export default PostItemPage;
