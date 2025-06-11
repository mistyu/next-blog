'use client';
import type { FC } from 'react';

import { TextAnimate } from '../../text/animate';
import { SparklesText } from '../../text/sparkles';
import $styles from './welcome.module.css';
export interface HomeWelcomeCardType {
  title: string;
  colorTitle?: string;
  content: string;
}

type Props = HomeWelcomeCardType;

export const HomeWelcomeCard: FC<Props> = ({ title, colorTitle, content }) => {
  return (
    <div className="tw-flex tw-h-full tw-w-full tw-flex-col">
      <div className="tw-flex tw-items-center tw-justify-center tw-text-3xl lg:tw-justify-start lg:tw-text-left lg:tw-text-5xl">
        {title}
        <SparklesText
          as={<span>{colorTitle && <span className={$styles.colorTitle}>{colorTitle}</span>}</span>}
        />
      </div>
      <div className="tw-font-lxgw tw-mt-5 tw-flex-auto tw-py-3 tw-text-xl !tw-leading-8 lg:tw-pr-16">
        <TextAnimate animation="blurInUp" by="line" once delay={0.8}>
          {content}
        </TextAnimate>
      </div>
    </div>
  );
};
