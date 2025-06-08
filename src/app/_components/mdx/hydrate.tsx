'use client';

import './styles/index.css';

import type { HydrateProps } from 'next-mdx-remote-client';
import type { FC } from 'react';

import { isNil } from 'lodash';
import { hydrate } from 'next-mdx-remote-client';
import { useMemo, useRef, useState } from 'react';
import { useDeepCompareEffect, useMount } from 'react-use';

import { deepMerge } from '@/libs/utils';

import type { MdxHydrateProps } from './types';

import Toc from './components/toc';
import { useCodeWindow } from './hooks/code-window';
import $styles from './hydrate.module.css';
import { defaultMdxHydrateOptions } from './options/hydrate';

export const MdxHydrate: FC<MdxHydrateProps> = (props) => {
  const { serialized, toc = true, ...rest } = props;
  const [content, setContent] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const options = useMemo(() => deepMerge(defaultMdxHydrateOptions, rest, 'merge'), [rest]);
  useMount(() => {
    // 确保页面完全加载
    if (typeof window !== 'undefined') {
      // 获取当前URL的hash
      const hash = decodeURIComponent(window.location.hash);
      if (hash) {
        // 延迟执行以确保DOM已完全渲染
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  });
  useDeepCompareEffect(() => {
    const { content, error } = hydrate({ ...serialized, ...options } as HydrateProps) as any;
    if (!error && !isNil(content)) setContent(content);
  }, [serialized, options]);
  useCodeWindow(contentRef, content);

  if (isNil(serialized) || 'error' in serialized) return null;
  return (
    !isNil(content) && (
      <div className={$styles.container}>
        <div className={$styles.article} ref={contentRef}>
          {content}
        </div>
        {toc && !isNil(serialized.scope?.toc) && (
          <div className={$styles.toc}>
            <Toc toc={serialized.scope.toc} />
          </div>
        )}
      </div>
    )
  );
};
