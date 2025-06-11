import type { FC } from 'react';

import Home from '@ricons/fluent/Home24Filled';
import { Slash, Tag } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../../shadcn/ui/breadcrumb';
import { cn } from '../../shadcn/utils';
import $styles from './style.module.css';
export interface IBlogBreadcrumbItem {
  id: string;
  link?: string;
  text: string;
}
interface IBlogBreadcrumbProps {
  className?: string;
  items?: IBlogBreadcrumbItem[];
  tag?: string;
  basePath?: string;
}
export const BlogBreadCrumb: FC<IBlogBreadcrumbProps> = (props) => {
  const { items, className, tag, basePath = '' } = props;
  return (
    <Breadcrumb className={cn($styles.breadcrumb, className)}>
      <BreadcrumbList className="tw-gap-0.5 sm:tw-gap-1">
        <BreadcrumbItem>
          <Link href="/" passHref legacyBehavior>
            <BreadcrumbLink className="tw-flex tw-items-center tw-text-xs">
              <span className="xicon tw-mr-1">
                <Home />
              </span>
              首页
            </BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        {(items ?? []).map((item) => (
          <Fragment key={item.id}>
            <BreadcrumbSeparator className="[&>svg]:tw-h-2 [&>svg]:tw-w-2">
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="tw-flex tw-items-center tw-text-xs">
              {item.link ? (
                <Link href={`${basePath}${item.link}`} passHref legacyBehavior>
                  <BreadcrumbLink>{item.text}</BreadcrumbLink>
                </Link>
              ) : (
                <span className="tw-text-foreground">{item.text}</span>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
      {tag && (
        <div className="tw-flex tw-h-full tw-items-center">
          <Tag className="!tw-h-3 !tw-w-3" />
          <span className="tw-ml-2">{tag}</span>
        </div>
      )}
    </Breadcrumb>
  );
};
