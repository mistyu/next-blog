import type { FC, PropsWithChildren } from 'react';

import { ShineBorder } from '../magicui/shine-border';
import { Card } from '../shadcn/ui/card';
import { cn } from '../shadcn/utils';

export const ShineCard: FC<
  PropsWithChildren<{ always?: boolean; className?: string; borderRadius?: string }>
> = ({ children, className, always, borderRadius = '0.25rem' }) => {
  return (
    <Card
      className={cn(
        'tw-bg-card/40 tw-backdrop-blur-sm',
        `!tw-rounded-[${borderRadius}]`,
        className,
      )}
    >
      <ShineBorder
        className="tw-h-full tw-w-full"
        color={['#A07CFE', '#FE8FB5', '#FFBE7B']}
        always={always}
        borderRadius={borderRadius}
      >
        {children}
      </ShineBorder>
    </Card>
  );
};
