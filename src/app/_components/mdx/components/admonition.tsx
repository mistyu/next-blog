import type { FC } from 'react';

import {
    AlertTriangle,
    Flame,
    Info,
    LightbulbIcon,
    type LucideIcon,
    NotebookPen,
} from 'lucide-react';
import React from 'react';

import type { AdmonitionType } from '../plugins/remark-admonitions';

import { cn } from '../../shadcn/utils';

const ADMONITION_CONFIG: Record<AdmonitionType, AdmonitionConfig> = {
    note: {
        icon: NotebookPen,
        title: '注意',
        containerClasses:
            'tw-bg-[#fdfdfe]/40 dark:tw-bg-[#474748]/30 tw-border-l-[#d4d5d8] dark:tw-border-l-[#a1a1a4]',
        iconClasses: 'tw-text-[#3578e5] dark:tw-text-[#2b60b8]',
        titleClasses: 'tw-text-[#3578e5] dark:tw-text-[#2b60b8]',
    },
    tip: {
        icon: LightbulbIcon,
        title: '提示',
        containerClasses:
            'tw-bg-[#e6f6e6]/40 dark:tw-bg-[#14532d]/30 tw-border-l-[#009400] dark:tw-border-l-[#2a8c2a]',
        iconClasses: 'tw-text-[#009400] dark:tw-text-[#2a8c2a]',
        titleClasses: 'tw-text-[#009400] dark:tw-text-[#2a8c2a]',
    },
    info: {
        icon: Info,
        title: '信息',
        containerClasses:
            'tw-bg-[#eef3fd]/40 dark:tw-bg-[#172554]/30 tw-border-l-[#3578e5] dark:tw-border-l-[#2b60b8]',
        iconClasses: 'tw-text-[#3578e5] dark:tw-text-[#2b60b8]',
        titleClasses: 'tw-text-[#3578e5] dark:tw-text-[#2b60b8]',
    },
    warning: {
        icon: AlertTriangle,
        title: '警告',
        containerClasses:
            'tw-bg-[#fff8e6]/40 dark:tw-bg-[#713f12]/30 tw-border-l-[#e6a700] dark:tw-border-l-[#b88a00]',
        iconClasses: 'tw-text-[#e6a700] dark:tw-text-[#b88a00]',
        titleClasses: 'tw-text-[#e6a700] dark:tw-text-[#b88a00]',
    },
    danger: {
        icon: Flame,
        title: '危险',
        containerClasses:
            'tw-bg-[#ffe3e3]/40 dark:tw-bg-[#7f1d1d]/30 tw-border-l-[#fa383e] dark:tw-border-l-[#c82333]',
        iconClasses: 'tw-text-[#fa383e] dark:tw-text-[#c82333]',
        titleClasses: 'tw-text-[#fa383e] dark:tw-text-[#c82333]',
    },
};

interface AdmonitionProps {
    type: AdmonitionType;
    title?: string;
    children: React.ReactNode;
}

export const Admonition: FC<AdmonitionProps> = ({ type, title, children }) => {
    const config = ADMONITION_CONFIG[type];
    const Icon = config.icon;

    return (
        <div
            className={cn(
                'tw-flex tw-my-4 tw-rounded tw-border-l-4 tw-p-2',
                'tw-shadow-sm dark:tw-shadow-none',
                config.containerClasses,
            )}
        >
            <div className="tw-flex tw-items-center tw-gap-2">
                <Icon className={cn('tw-h-5 tw-w-5', config.iconClasses)} />
                <p className={cn(config.titleClasses)}>{title || config.title}</p>
            </div>
            <div className="tw-prose dark:tw-prose-invert">{children}</div>
        </div>
    );
};

interface AdmonitionConfig {
    icon: LucideIcon;
    title: string;
    containerClasses: string;
    iconClasses: string;
    titleClasses: string;
}
