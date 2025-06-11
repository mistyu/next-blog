import type { FC } from 'react';

import Book from '@ricons/material/BookOutlined';
import { isNil } from 'lodash';
import { Calendar, Tag, User } from 'lucide-react';
import Link from 'next/link';

import type { CategoryItem } from '@/server/category/type';
import type { PostItem } from '@/server/post/type';

import { randomIntFrom } from '@/libs/random';
import { formatTime } from '@/libs/time';

import type { IPaginateQueryProps } from '../../paginate/types';

import { cn } from '../../shadcn/utils';
import { TagLink } from '../form/tag';
import { getNestLinks } from '../utils';
import { PostActions } from './actions';
import BlogIcons from './blog-icons.png';
import { PostListItemMotion } from './item-motion';
import $styles from './style.module.css';
export interface PostListProps extends IPaginateQueryProps {
  tag?: string;
  category?: CategoryItem;
}

export const PostList: FC<{ items: PostItem[]; activeTag?: string }> = ({ items, activeTag }) => (
  <div className={cn($styles.list)}>
    {items.map((item) => (
      <PostListItemMotion key={item.id}>
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
              {item.categories.length > 0 && (
                <div className={$styles.categories}>
                  <span className="xicon tw-mr-2 tw-text-lg">
                    <Book />
                  </span>
                  {getNestLinks(item.categories, 'post').map((category) => (
                    <Link
                      key={category.id}
                      href={`/blog${category.link!}`}
                      className="tw-ellips tw-animate-decoration tw-animate-decoration-sm"
                    >
                      #{category.text}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </header>

          {!isNil(item.summary) && <div className={$styles.summary}>{item.summary}</div>}
          <div className={$styles.footer}>
            <div className={$styles.meta}>
              {item.tags.length > 0 && (
                <div className={cn($styles.tags, 'tw-relative tw-z-[2]')}>
                  <span className="tw-mr-2">
                    <Tag />
                  </span>
                  {item.tags.map((tagItem) => (
                    <TagLink
                      key={tagItem.id}
                      tag={tagItem}
                      className={cn({
                        [$styles.tagActived]: activeTag === tagItem.text,
                      })}
                    />
                  ))}
                </div>
              )}
              <div className={$styles.info}>
                <span>
                  <User className="tw-mr-2" /> {item.author.username}
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
      </PostListItemMotion>
    ))}
  </div>
);
