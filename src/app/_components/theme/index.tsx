'use client';
import { isNil } from 'lodash';
import { type FC, type PropsWithChildren, useEffect, useRef } from 'react';

import type { ThemeOptions, ThemeStoreType } from './types';

import { ThemeContext } from './constants';
import { useSystemTheme, useThemeStore } from './hooks';
import { createThemeStore } from './store';

/**
 * 主题状态改变的订阅器，用于监听主题状态的变化从而为html元素添加对应的类名
 * @param param0
 */
const ThemeSubscriber: FC<PropsWithChildren> = ({ children }) => {
  const systemTheme = useSystemTheme();
  const store = useThemeStore();
  let unSub: () => void;
  useEffect(() => {
    unSub = store.subscribe(
      (state) => state.mode,
      (m) => {
        const html = document.getElementsByTagName('html');
        if (html.length) {
          html[0].classList.remove('light', 'dark', 'tw-light', 'tw-dark');
          if (m === 'system') {
            html[0].classList.add(systemTheme, `tw-${systemTheme}`);
          } else {
            m === 'dark'
              ? html[0].classList.add('dark', 'tw-dark')
              : html[0].classList.add('light', 'tw-light');
          }
        }
      },
      {
        fireImmediately: true,
      },
    );
    return () => {
      if (!isNil(unSub)) unSub();
    };
  }, [systemTheme]);
  return <>{children}</>;
};

/**
 * 主题状态包装器组件
 */
const Theme: FC<PropsWithChildren<Partial<ThemeOptions>>> = ({ children, ...props }) => {
  const storeRef = useRef<ThemeStoreType>(null);
  if (!storeRef.current) {
    storeRef.current = createThemeStore(props);
  }
  return (
    <ThemeContext value={storeRef.current}>
      <ThemeSubscriber>{children} </ThemeSubscriber>
    </ThemeContext>
  );
};
export default Theme;
