import type { FC } from 'react';

import { House } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/app/_components/shadcn/utils';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../../shadcn/ui/navigation-menu';
import $styles from './nav.module.css';

const items = [
  {
    title: '首页',
    href: '/',
    icon: House,
  },
];
export const HeaderNav: FC = () => (
  <div className={$styles.nav}>
    <NavigationMenu className={$styles.menus}>
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.href} className={cn($styles['menu-item'])}>
            <NavigationMenuLink href={item.href} className={cn(navigationMenuTriggerStyle())}>
              {item.icon && <item.icon className="tw-mr-1" />}
              {item.title}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  </div>
);

export const MobileNav: FC = () => (
  <div className={$styles.mobileNav}>
    <ul>
      {items.map((item) => (
        <li key={item.href} className={$styles['mobile-menu-item']}>
          {item.icon && <item.icon className="tw-mr-2" />}
          <Link href={item.href}>{item.title}</Link>
        </li>
      ))}
    </ul>
  </div>
);
