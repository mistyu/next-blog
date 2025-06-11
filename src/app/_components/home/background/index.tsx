import type { FC } from 'react';

import { MouseMoveEffect } from './mouse-move-effect';

export const HomeBackground: FC = () => (
  <>
    <div className="tw-pointer-events-none tw-fixed tw-inset-0">
      <div className="tw-absolute tw-right-0 tw-top-0 tw-h-[30rem] tw-w-[30rem] tw-bg-orange-500/10 tw-blur-[100px]" />
      <div className="tw-absolute tw-bottom-0 tw-left-0 tw-h-[30rem] tw-w-[30rem] tw-bg-blue-500/10 tw-blur-[100px]" />
    </div>
    <MouseMoveEffect />
  </>
);
