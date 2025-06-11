'use client';
import type { FC } from 'react';

import Play from '@ricons/fluent/Play20Filled';
import { useCallback, useState } from 'react';

import { StackCard } from '../../cards/stack';
import { VideoModal } from '../../modal/video';
import $styles from './video.module.css';

export interface HomeVideoCardType {
  image: string;
  video: string;
}
type Props = HomeVideoCardType;
export const HomeVideoCard: FC<Props> = ({ image, video }) => {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  return (
    <>
      <StackCard
        shine={{ open: true, always: true }}
        className="tw-flex tw-h-auto tw-w-full tw-items-center tw-justify-center"
      >
        <div
          className={$styles.main}
          style={{
            backgroundImage: image,
          }}
        >
          <button onClick={openModal} type="button" className={$styles.openBtn}>
            <Play className="!tw-size-8 tw-text-white" />
          </button>
        </div>
      </StackCard>
      <VideoModal video={{ url: video }} open={open} setOpen={setOpen} />
    </>
  );
};
