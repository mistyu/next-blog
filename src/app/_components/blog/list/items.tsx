import type { FC } from 'react';

import { isNil } from 'lodash';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';

import type { PostItem } from '@/server/post/type';

import { randomIntFrom } from '@/libs/random';
import { formatTime } from '@/libs/time';

import type { IPaginateQueryProps } from '../../paginate/types';

import { cn } from '../../shadcn/utils';
import { PostActions } from './actions';
import BlogIcons from './blog-icons.png';
import $styles from './style.module.css';
export interface PostListProps extends IPaginateQueryProps {}

export const PostList: FC<{ items: PostItem[] }> = ({ items }) => (
  <div className={cn($styles.list)}>
    {items.map((item) => (
      <div key={item.id} className={$styles.item}>
        <div className={cn($styles.content, 'tw-page-block hover:tw-page-block-hover')}>
          <Link
            href={`/blog/post/${item.slug || item.id}`}
            className="tw-absolute tw-inset-0 tw-z-[1]"
          ></Link>
          <header className={$styles.header}>
            <div
              className={$styles.icon}
              style={{
                backgroundImage: `url(${BlogIcons.src})`,
                backgroundPositionY: `${randomIntFrom(0, 6) * -40}px`,
              }}
            />
            <div className={cn($styles.headerRight, 'tw-relative tw-z-[2]')}>
              <Link href={`/blog/post/${item.slug || item.id}`} className={$styles.title}>
                <h2 className="tw-ellips tw-animate-decoration tw-animate-decoration-lg">
                  {item.title}
                </h2>
              </Link>
            </div>
          </header>

          {!isNil(item.summary) && <div className={$styles.summary}>{item.summary}</div>}
          <div className={$styles.footer}>
            <div className={$styles.meta}>
              <div className={$styles.info}>
                <span>
                  <User className="tw-mr-2" /> yuyue
                </span>
                <span>
                  <Calendar className="tw-mr-2" />
                  <time className="tw-ellips">
                    {formatTime(!isNil(item.updatedAt) ? item.updatedAt : item.createdAt)}
                  </time>
                </span>
              </div>
            </div>
            <PostActions item={item} className="tw-relative tw-z-[2]" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
