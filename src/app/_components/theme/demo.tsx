'use client';
import type { FC } from 'react';

import { Calendar } from 'antd';

import $styles from '../../demo/_components/style.module.css';
import { AntdThemeSetting } from './setting';
const ThemeDemo: FC = () => (
  <div className={$styles.container}>
    <h2 className="tw-text-center">Setting Demo</h2>
    <div className="tw-flex tw-flex-col tw-items-center">
      <div className="tw-mb-5 tw-flex-auto">
        <AntdThemeSetting />
      </div>
      <div className="tw-max-w-md">
        <Calendar fullscreen={false} />
      </div>
    </div>
  </div>
);
export default ThemeDemo;
