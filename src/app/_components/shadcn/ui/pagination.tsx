import { isNil } from 'lodash';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import type { ButtonProps } from '@/app/_components/shadcn/ui/button';

import { buttonVariants } from '@/app/_components/shadcn/ui/button';
import { cn } from '@/app/_components/shadcn/utils';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('tw-mx-auto tw-flex tw-w-full tw-justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn('tw-flex tw-flex-row tw-items-center tw-gap-1', className)}
      {...props}
    />
  ),
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn(className)} {...props} />,
);
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  text?: string;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? 'page' : undefined}
    aria-disabled={props.disabled}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      cn({ 'tw-pointer-events-none tw-opacity-50': props.disabled }),
      className,
    )}
    href={isNil(props.href) ? ':' : props.href}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  text,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('tw-gap-1 tw-pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="tw-h-4 tw-w-4" />
    <span>{text ?? 'Previous'}</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  text,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('tw-gap-1 tw-pr-2.5', className)}
    {...props}
  >
    <span>{text ?? 'Next'}</span>
    <ChevronRight className="tw-h-4 tw-w-4" />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  text,
  ...props
}: React.ComponentProps<'span'> & { text?: string }) => (
  <span
    aria-hidden
    className={cn('tw-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="tw-h-4 tw-w-4" />
    <span className="tw-sr-only">{text ?? 'More pages'}</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
