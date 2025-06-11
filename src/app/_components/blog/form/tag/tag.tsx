/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { cva } from 'class-variance-authority';
import React from 'react';

import { Button } from '@/app/_components/shadcn/ui/button';
import { cn } from '@/app/_components/shadcn/utils';

import type { TagInputProps, TagInputStyleClassesProps, Tag as TagType } from './tag-input';

export const tagVariants = cva(
  'tw-inline-flex tw-items-center tw-rounded-md tw-border tw-pl-2 tw-text-sm tw-transition-all',
  {
    variants: {
      variant: {
        default:
          'tw-bg-secondary tw-text-secondary-foreground hover:tw-bg-secondary/80 disabled:tw-cursor-not-allowed disabled:tw-opacity-50',
        primary:
          'tw-border-primary tw-bg-primary tw-text-primary-foreground hover:tw-bg-primary/90 disabled:tw-cursor-not-allowed disabled:tw-opacity-50',
        destructive:
          'tw-border-destructive tw-bg-destructive tw-text-destructive-foreground hover:tw-bg-destructive/90 disabled:tw-cursor-not-allowed disabled:tw-opacity-50',
      },
      size: {
        sm: 'tw-h-7 tw-text-xs',
        md: 'tw-h-8 tw-text-sm',
        lg: 'tw-h-9 tw-text-base',
        xl: 'tw-h-10 tw-text-lg',
      },
      shape: {
        default: 'tw-rounded-sm',
        rounded: 'tw-rounded-lg',
        square: 'tw-rounded-none',
        pill: 'tw-rounded-full',
      },
      borderStyle: {
        default: 'tw-border-solid',
        none: 'tw-border-none',
        dashed: 'tw-border-dashed',
        dotted: 'tw-border-dotted',
        double: 'tw-border-double',
      },
      textCase: {
        uppercase: 'tw-uppercase',
        lowercase: 'tw-lowercase',
        capitalize: 'tw-capitalize',
      },
      interaction: {
        clickable: 'tw-cursor-pointer hover:tw-shadow-md',
        nonClickable: 'tw-cursor-default',
      },
      animation: {
        none: '',
        fadeIn: 'tw-animate-fadeIn',
        slideIn: 'tw-animate-slideIn',
        bounce: 'tw-animate-bounce',
      },
      textStyle: {
        normal: 'tw-font-normal',
        bold: 'tw-font-bold',
        italic: 'tw-italic',
        underline: 'tw-underline',
        lineThrough: 'tw-line-through',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'default',
      borderStyle: 'default',
      interaction: 'nonClickable',
      animation: 'fadeIn',
      textStyle: 'normal',
    },
  },
);

export type TagProps = {
  tagObj: TagType;
  variant: TagInputProps['variant'];
  size: TagInputProps['size'];
  shape: TagInputProps['shape'];
  borderStyle: TagInputProps['borderStyle'];
  textCase: TagInputProps['textCase'];
  interaction: TagInputProps['interaction'];
  animation: TagInputProps['animation'];
  textStyle: TagInputProps['textStyle'];
  onRemoveTag: (id: string) => void;
  isActiveTag?: boolean;
  tagClasses?: TagInputStyleClassesProps['tag'];
  disabled?: boolean;
} & Pick<TagInputProps, 'direction' | 'onTagClick' | 'draggable'>;

export const Tag: React.FC<TagProps> = ({
  tagObj,
  direction,
  draggable,
  onTagClick,
  onRemoveTag,
  variant,
  size,
  shape,
  borderStyle,
  textCase,
  interaction,
  animation,
  textStyle,
  isActiveTag,
  tagClasses,
  disabled,
}) => {
  return (
    <span
      key={tagObj.id}
      draggable={draggable}
      className={cn(
        tagVariants({
          variant,
          size,
          shape,
          borderStyle,
          textCase,
          interaction,
          animation,
          textStyle,
        }),
        {
          'tw-justify-between tw-w-full': direction === 'column',
          'tw-cursor-pointer': draggable,
          'tw-ring-ring tw-ring-offset-2 tw-ring-2 tw-ring-offset-background': isActiveTag,
        },
        tagClasses?.body,
      )}
      onClick={() => onTagClick?.(tagObj)}
    >
      {tagObj.text}
      <Button
        type="button"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation(); // Prevent event from bubbling up to the tag span
          onRemoveTag(tagObj.id);
        }}
        disabled={disabled}
        className={cn(
          `tw-py-1 tw-pl-3 tw-pr-1 tw-h-full hover:tw-bg-transparent`,
          tagClasses?.closeButton,
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="tw-lucide tw-lucide-x"
        >
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </Button>
    </span>
  );
};
