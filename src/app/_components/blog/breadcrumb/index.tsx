import type { FC } from 'react';

import Home from '@ricons/fluent/Home24Filled';
import { Slash } from 'lucide-react';
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
}
export const BlogBreadCrumb: FC<IBlogBreadcrumbProps> = (props) => {
  const { items, className } = props;
  return (
    <Breadcrumb className={cn($styles.breadcrumb, className)}>
      <BreadcrumbList className="tw-gap-0.5 sm:tw-gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="tw-flex tw-items-center tw-text-xs">
            <span className="xicon tw-mr-1">
              <Home />
            </span>
            首页
          </BreadcrumbLink>
        </BreadcrumbItem>
        {(items ?? []).map((item) => (
          <Fragment key={item.id}>
            <BreadcrumbSeparator className="[&>svg]:tw-h-2 [&>svg]:tw-w-2">
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="tw-flex tw-items-center tw-text-xs">
              {item.link ? (
                <BreadcrumbLink href={item.link}>{item.text}</BreadcrumbLink>
              ) : (
                <span className="tw-text-foreground">{item.text}</span>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
