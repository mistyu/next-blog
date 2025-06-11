import type { FC } from 'react';

import { isNil } from 'lodash';
import { Calendar, Tag, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import type { IBlogBreadcrumbItem } from '@/app/_components/blog/breadcrumb';

import { postApi } from '@/api/post';
import { BlogBreadCrumb } from '@/app/_components/blog/breadcrumb';
import { getNestLinks } from '@/app/_components/blog/utils';
import { MdxRender } from '@/app/_components/mdx/render';
import { cn } from '@/app/_components/shadcn/utils';
import { formatTime } from '@/libs/time';

import { PostEditButton } from '../list/actions/edit-button';
import { PostItemSkeleton } from '../skeleton';
import $styles from './style.module.css';

export const PostItemIndex: FC<{ item: string }> = async ({ item }) => {
  const result = await postApi.detail(item);
  if (!result.ok) {
    if (result.status !== 404) throw new Error((await result.json()).message);
    return notFound();
  }
  const post = await result.json();
  const breadcrumbs: IBlogBreadcrumbItem[] = [...getNestLinks(post.categories, 'post')];

  breadcrumbs.push({
    id: post.id,
    text: post.title,
  });

  return (
    <div className="tw-page-item">
      <Suspense fallback={<PostItemSkeleton />}>
        <div className={cn($styles.breadcrumbs, 'tw-page-container')}>
          <BlogBreadCrumb items={breadcrumbs} basePath="/blog" />
        </div>
        <div className={cn($styles.item, 'tw-page-container')}>
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
                      <PostEditButton item={post} />
                    </div>
                  </header>
                  <div className={$styles.meta}>
                    <div className={$styles.info}>
                      <span>
                        <User className="tw-mr-2" /> {post.author.username}
                      </span>
                      <span>
                        <Calendar className="tw-mr-2" />
                        <time className="tw-ellips tw-mt-1">
                          {formatTime(!isNil(post.updatedAt) ? post.updatedAt : post.createdAt)}
                        </time>
                      </span>
                    </div>
                    {post.tags.length > 0 && (
                      <div className={$styles.tags}>
                        <span className="tw-mr-2">
                          <Tag />
                        </span>
                        {post.tags.map((tag) => (
                          <Link key={tag.id} href={`/blog?tag=${tag.text}`}>
                            {tag.text}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              }
            />
          </div>
        </div>
      </Suspense>
    </div>
  );
};
