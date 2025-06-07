import type { FC } from 'react';

import { cn } from '@/app/_components/shadcn/utils';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../shadcn/ui/navigation-menu';
import $styles from './nav.module.css';

const items = [
  {
    title: '首页',
    href: '/',
  },
];
export const HeaderNav: FC = () => (
  <div className={$styles.nav}>
    <NavigationMenu className={$styles.menus}>
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.href} className={cn($styles['menu-item'])}>
            <NavigationMenuLink href={item.href} className={cn(navigationMenuTriggerStyle())}>
              {item.title}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  </div>
);
