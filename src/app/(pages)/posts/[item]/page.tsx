import type { Metadata, ResolvingMetadata } from 'next';
import type { FC } from 'react';

import { isNil } from 'lodash';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { MdxRender } from '@/app/_components/mdx/render';
import { PostEditButton } from '@/app/_components/post/edit-button';
import { fetchApi } from '@/libs/api';
import { formatChineseTime } from '@/libs/time';

import $styles from './page.module.css';

export const generateMetadata = async (
  { params }: { params: Promise<{ item: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const { item } = await params;
  const result = await fetchApi(async (c) => c.api.posts[':item'].$get({ param: { item } }));
  if (!result.ok) return {};
  const post = await result.json();

  return {
    title: `${post.title} - ${(await parent).title?.absolute}`,
    keywords: post.keywords,
    description: post.description,
  };
};

const PostItemPage: FC<{ params: Promise<{ item: string }> }> = async ({ params }) => {
  const { item } = await params;
  const result = await fetchApi(async (c) => c.api.posts[':item'].$get({ param: { item } }));
  if (!result.ok) {
    if (result.status !== 404) throw new Error((await result.json()).message);
    return notFound();
  }
  const post = await result.json();

  return (
    <div className="tw-page-container">
      <div className={$styles.item}>
        <div className={$styles.thumb}>
          <Image src={post.thumb} alt={post.title} fill priority sizes="100%" unoptimized />
        </div>

        <div className={$styles.content}>
          <MdxRender
            source={post.body}
            header={
              <>
                <header className={$styles.title}>
                  <h1 className="tw-text-lg lg:tw-text-3xl">{post.title}</h1>
                  <div className="tw-ml-2">
                    <PostEditButton id={post.id} iconBtn />
                  </div>
                </header>
                <div className={$styles.meta}>
                  <div>
                    <span>
                      <Calendar />
                    </span>
                    <time className="tw-ellips">
                      {!isNil(post.updatedAt)
                        ? formatChineseTime(new Date(post.updatedAt))
                        : formatChineseTime(new Date(post.createdAt))}
                    </time>
                  </div>
                </div>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PostItemPage;
