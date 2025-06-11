import type { FC } from 'react';

import React from 'react';

import { cn } from '@/app/_components/shadcn/utils';

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const RainbowButton: FC<RainbowButtonProps> = (props) => {
  const { children, className, ...rest } = props;
  return (
    <button
      type="button"
      className={cn(
        `tw-relative tw-inline-flex tw-h-11 tw-animate-rainbow tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-md
                                                tw-border-0 tw-bg-[length:200%] tw-px-8 tw-py-2 tw-font-medium tw-text-primary-foreground tw-transition-colors 
                                                [background-clip:tw-padding-box,border-box,border-box] [background-origin:tw-border-box] [border:calc(0.08*1rem)_solid_transparent]
                                                focus-visible:tw-outline-none focus-visible:tw-ring-1 focus-visible:tw-ring-ring disabled:tw-pointer-events-none disabled:tw-opacity-50`,

        // before styles
        `before:tw-absolute before:tw-bottom-[-20%] before:tw-left-1/2 before:tw-z-0
                                                before:tw-h-1/5 before:tw-w-3/5 before:tw--translate-x-1/2
                                                before:tw-animate-rainbow before:tw-bg-[length:200%_100%]
                                                before:tw-bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]
                                                before:[filter:blur(calc(0.5rem))] dark:before:[filter:blur(calc(0.8rem))]`,

        // light mode colors
        `tw-bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]`,

        // dark mode colors
        `dark:tw-bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]`,

        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
