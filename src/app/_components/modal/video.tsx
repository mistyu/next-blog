'use client';
import type VideoOption from 'artplayer/types/option';
import type { FC } from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import CloseIcon from '@ricons/material/CloseFilled';
import { useCallback } from 'react';

import { deepMerge } from '@/libs/utils';

import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '../shadcn/ui/dialog';
import { cn } from '../shadcn/utils';
import { Player } from '../video/player';
import $styles from './video.module.css';
interface Props {
  className?: string;
  video: Omit<VideoOption, 'container'>;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const VideoModal: FC<Props> = ({ className, video, open, setOpen }) => {
  const videoOption = deepMerge(video, { autoplay: false, muted: false }, 'replace');
  const close = useCallback(() => setOpen(false), []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogHeader className="tw-hidden">
        <DialogTitle></DialogTitle>
        <DialogDescription />
      </DialogHeader>
      <DialogPortal>
        <DialogOverlay className={$styles.overlay} />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn($styles.content, className)}
          // onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <div className="tw-mb-2 tw-flex tw-w-full tw-items-center tw-justify-center">
            <button type="button" className={$styles.closeBtn} onClick={close}>
              <span className="xicon">
                <CloseIcon />
              </span>
            </button>
          </div>

          <Player option={videoOption} />
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
