import type { FC } from 'react';

import { Skeleton } from '../shadcn/ui/skeleton';
import { HomeContainer } from './container';
const OneBlock: FC = () => (
  <HomeContainer
    containerClass="tw-h-full tw-w-full tw-flex-auto !tw-items-stretch"
    className="!tw-items-stretch"
  >
    <div className="tw-flex tw-flex-auto !tw-items-stretch">
      <Skeleton className="tw-flex tw-w-full tw-flex-auto tw-bg-gray-950/30 tw-backdrop-blur-sm" />
    </div>
  </HomeContainer>
);
const TwoBlock: FC = () => (
  <HomeContainer
    containerClass="tw-h-full tw-w-full tw-flex-auto !tw-items-stretch"
    className="tw-flex-col !tw-items-stretch tw-space-y-2 md:tw-flex-row md:tw-space-x-3 md:tw-space-y-0"
  >
    <div className="tw-flex tw-flex-auto !tw-items-stretch">
      <Skeleton className="tw-flex  tw-w-full tw-flex-auto tw-bg-gray-950/30 tw-backdrop-blur-sm" />
    </div>
    <div className="tw-flex tw-flex-auto !tw-items-stretch">
      <Skeleton className="tw-flex tw-w-full tw-flex-auto tw-bg-gray-950/30 tw-backdrop-blur-sm" />
    </div>
  </HomeContainer>
);

export const HomeSeketon: FC = () => (
  <>
    <TwoBlock />
    <OneBlock />
    <TwoBlock />
  </>
);
