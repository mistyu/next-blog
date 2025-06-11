import type { FC, PropsWithChildren } from 'react';

import { ShineBorder } from '../magicui/shine-border';
import { Card } from '../shadcn/ui/card';
import { cn } from '../shadcn/utils';

interface StackCardProps {
  className?: string;
  padding?: string;
  shine?: { open?: boolean; always?: boolean };
}
export const StackCard: FC<PropsWithChildren<StackCardProps>> = ({
  children,
  shine,
  className,
  padding = '0.75rem',
}) => {
  return (
    <div
      className={cn(
        `tw-relative tw-flex tw-h-80 tw-w-full tw-items-center tw-justify-center`,
        className,
      )}
    >
      <div
        className={cn(
          'tw-absolute tw-bottom-0 tw-left-0 tw-w-32 tw-h-32 tw-bg-blue-500 tw-rounded-full tw-blur-2xl tw-opacity-50 tw-animate-pulse',
        )}
      />
      <div
        className={cn(
          'tw-absolute tw-top-0 tw-right-0 tw-w-32 tw-h-32 tw-bg-orange-500 tw-rounded-full tw-blur-2xl tw-opacity-50 tw-animate-pulse',
        )}
      />
      <div className="tw-h-full tw-w-full">
        <div className="tw-relative tw-h-full tw-w-full">
          <Card
            className={cn(
              'tw-absolute tw-inset-0',
              'tw-bg-card/20 tw-backdrop-blur-sm',
              'tw-rotate-[-4deg] tw-translate-y-2',
              '!tw-rounded-sm',
            )}
          />
          <Card
            className={cn(
              'tw-absolute tw-inset-0',
              'tw-bg-card/30 tw-backdrop-blur-sm',
              'tw-rotate-[-2deg] tw-translate-y-1',
              '!tw-rounded-sm',
            )}
          />
          <Card
            className={cn(
              'tw-absolute tw-inset-0',
              'tw-bg-card/40 tw-backdrop-blur-sm',
              '!tw-rounded-sm',
            )}
          >
            {shine ? (
              <ShineBorder
                className="tw-relative tw-h-full tw-w-full tw-rounded-sm"
                color={['#A07CFE', '#FE8FB5', '#FFBE7B']}
                always={shine.always}
                padding={padding}
              >
                {children}
              </ShineBorder>
            ) : (
              children
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
