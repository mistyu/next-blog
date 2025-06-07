'use client';

import type { FC } from 'react';

import { PostDelete } from './delete';
import { PostEditButton } from './edit-button';

export const PostActionButtons: FC<{ id: string }> = ({ id }) => {
  return (
    <div className="tw-flex tw-items-center [&>time]:tw-ml-2">
      <PostEditButton id={id} />
      <PostDelete id={id} />
    </div>
  );
};
