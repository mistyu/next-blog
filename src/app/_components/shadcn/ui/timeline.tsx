/* eslint-disable jsx-a11y/no-redundant-roles */
import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import { Check, Circle, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/app/_components/shadcn/utils';

const timelineVariants = cva('tw-grid', {
  variants: {
    positions: {
      left: '[&>li]:tw-grid-cols-[0_min-content_1fr]',
      right: '[&>li]:tw-grid-cols-[1fr_min-content]',
      center: '[&>li]:tw-grid-cols-[1fr_min-content_1fr]',
    },
  },
  defaultVariants: {
    positions: 'left',
  },
});

interface TimelineProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof timelineVariants> {}

const Timeline = React.forwardRef<HTMLUListElement, TimelineProps>(
  ({ children, className, positions, ...props }, ref) => {
    return (
      <ul className={cn(timelineVariants({ positions }), className)} ref={ref} {...props}>
        {children}
      </ul>
    );
  },
);
Timeline.displayName = 'Timeline';

const timelineItemVariants = cva('tw-grid tw-items-center tw-gap-x-2', {
  variants: {
    status: {
      done: 'tw-text-primary',
      default: 'tw-text-muted-foreground',
    },
  },
  defaultVariants: {
    status: 'default',
  },
});

interface TimelineItemProps
  extends React.HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof timelineItemVariants> {}

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ className, status, ...props }, ref) => (
    <li className={cn(timelineItemVariants({ status }), className)} ref={ref} {...props} />
  ),
);
TimelineItem.displayName = 'TimelineItem';

const timelineDotVariants = cva(
  'tw-col-start-2 tw-col-end-3 tw-row-start-1 tw-row-end-1 tw-flex tw-size-4 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-current',
  {
    variants: {
      status: {
        default: '[&>*]:tw-hidden',
        current:
          '[&>*:not(.lucide-circle)]:tw-hidden [&>.lucide-circle]:tw-fill-current [&>.lucide-circle]:tw-text-current',
        done: 'tw-bg-primary [&>*:not(.lucide-check)]:tw-hidden [&>.lucide-check]:tw-text-background',
        error:
          'tw-border-destructive tw-bg-destructive [&>*:not(.lucide-x)]:tw-hidden [&>.lucide-x]:tw-text-background',
        custom: '[&>*:not(:nth-child(4))]:tw-hidden [&>*:nth-child(4)]:tw-block',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  },
);

interface TimelineDotProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineDotVariants> {
  customIcon?: React.ReactNode;
  Wrapper?: (
    props: React.PropsWithChildren<{
      className: string;
    }>,
  ) => React.JSX.Element;
}

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, status, Wrapper, customIcon, ...props }, ref) =>
    Wrapper ? (
      <Wrapper className={cn('tw-timeline-dot', timelineDotVariants({ status }), className)}>
        <div role="status" ref={ref} {...props}>
          <Circle className="tw-size-2.5" />
          <Check className="tw-size-3" />
          <X className="tw-size-3" />
          {customIcon}
        </div>
      </Wrapper>
    ) : (
      <div
        role="status"
        className={cn('tw-timeline-dot', timelineDotVariants({ status }), className)}
        ref={ref}
        {...props}
      >
        <Circle className="tw-size-2.5" />
        <Check className="tw-size-3" />
        <X className="tw-size-3" />
        {customIcon}
      </div>
    ),
);
TimelineDot.displayName = 'TimelineDot';

const timelineContentVariants = cva(
  'tw-row-start-2 tw-row-end-2 tw-pb-8 tw-text-muted-foreground',
  {
    variants: {
      side: {
        right: 'tw-col-start-3 tw-col-end-4 tw-mr-auto tw-text-left',
        left: 'tw-col-start-1 tw-col-end-2 tw-ml-auto tw-text-right',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

interface TimelineContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineContentVariants> {
  Wrapper?: (
    props: React.PropsWithChildren<{
      className: string;
      side: 'left' | 'right' | null | undefined;
    }>,
  ) => React.JSX.Element;
}

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, Wrapper, side, ...props }, ref) => {
    return Wrapper ? (
      <Wrapper className={cn(timelineContentVariants({ side }), className)} side={side}>
        <div ref={ref} {...props}></div>
      </Wrapper>
    ) : (
      <div className={cn(timelineContentVariants({ side }), className)} ref={ref} {...props} />
    );
  },
);
TimelineContent.displayName = 'TimelineContent';

const timelineHeadingVariants = cva(
  'tw-row-start-1 tw-row-end-1 tw-line-clamp-1 tw-max-w-full tw-truncate',
  {
    variants: {
      side: {
        right: 'tw-col-start-3 tw-col-end-4 tw-mr-auto tw-text-left',
        left: 'tw-col-start-1 tw-col-end-2 tw-ml-auto tw-text-right',
      },
      variant: {
        primary: 'tw-text-base tw-font-medium tw-text-primary',
        secondary: 'tw-text-sm tw-font-light tw-text-muted-foreground',
      },
    },
    defaultVariants: {
      side: 'right',
      variant: 'primary',
    },
  },
);

interface TimelineHeadingProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof timelineHeadingVariants> {
  Wrapper?: (
    props: React.PropsWithChildren<{
      className: string;
      side: 'left' | 'right' | null | undefined;
    }>,
  ) => React.JSX.Element;
}

const TimelineHeading = React.forwardRef<HTMLParagraphElement, TimelineHeadingProps>(
  ({ className, side, variant, Wrapper, ...props }, ref) => {
    return Wrapper ? (
      <Wrapper className={cn(timelineHeadingVariants({ side, variant }), className)} side={side}>
        <p role="heading" aria-level={variant === 'primary' ? 2 : 3} ref={ref} {...props} />
      </Wrapper>
    ) : (
      <p
        role="heading"
        aria-level={variant === 'primary' ? 2 : 3}
        className={cn(timelineHeadingVariants({ side, variant }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
TimelineHeading.displayName = 'TimelineHeading';

interface TimelineLineProps extends React.HTMLAttributes<HTMLHRElement> {
  done?: boolean;
  Wrapper?: (
    props: React.PropsWithChildren<{
      className: string;
    }>,
  ) => React.JSX.Element;
}

const TimelineLine = React.forwardRef<HTMLHRElement, TimelineLineProps>(
  ({ className, done = false, Wrapper, ...props }, ref) => {
    return Wrapper ? (
      <Wrapper
        className={cn(
          'tw-col-start-2 tw-col-end-3 tw-row-start-2 tw-row-end-2 tw-mx-auto tw-flex tw-h-full tw-min-h-16 tw-w-0.5 tw-justify-center tw-rounded-full',
          done ? 'tw-bg-primary' : 'tw-bg-muted',
          className,
        )}
      >
        <hr role="separator" aria-orientation="vertical" ref={ref} {...props} />
      </Wrapper>
    ) : (
      <hr
        role="separator"
        aria-orientation="vertical"
        className={cn(
          'tw-col-start-2 tw-col-end-3 tw-row-start-2 tw-row-end-2 tw-mx-auto tw-flex tw-h-full tw-min-h-16 tw-w-0.5 tw-justify-center tw-rounded-full',
          done ? 'tw-bg-primary' : 'tw-bg-muted',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
TimelineLine.displayName = 'TimelineLine';

export { Timeline, TimelineContent, TimelineDot, TimelineHeading, TimelineItem, TimelineLine };
