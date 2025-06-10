'use client';

import type { FC, MouseEventHandler } from 'react';

import { isNil } from 'lodash';
import { User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback } from 'react';

import { authApi } from '@/api/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/_components/shadcn/ui/avatar';
import { Button } from '@/app/_components/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/_components/shadcn/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/_components/shadcn/ui/tooltip';
import { cn } from '@/app/_components/shadcn/utils';
import { deleteCookie } from '@/libs/coolkies';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/server/auth/token';

import { useAuth, useAuthSetChecked, useSetAuth } from '../../../auth/hooks';
import { useToast } from '../../../shadcn/hooks/use-toast';
import UserAvatar from './avatar.jpg';
import $styles from './user-action.module.css';

export const UserActionButton: FC = () => {
  const auth = useAuth();
  const setAuth = useSetAuth();
  const changeAuthCheck = useAuthSetChecked();
  const router = useRouter();
  const { toast } = useToast();
  const loginOut: MouseEventHandler<HTMLAnchorElement> = useCallback(
    async (e) => {
      e.preventDefault();
      const res = await authApi.logout();
      if (res.ok) {
        deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
        setAuth(null);
        changeAuthCheck(false);
        router.push('/auth/login');
      } else {
        toast({
          variant: 'destructive',
          title: '服务器错误,请重试！',
          description: (await res.json()).message,
        });
      }
    },
    [toast],
  );
  return (
    <div className={cn($styles.user)}>
      {isNil(auth) ? (
        <Suspense>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild className="tw-ml-auto tw-size-9 tw-justify-end" variant="outline">
                  <Link href="/auth/login">
                    <User />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>登录账户</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Suspense>
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Avatar className={$styles.avatar}>
              <AvatarImage src={UserAvatar.src} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="tw-w-56 tw-text-center tw-text-stone-500">
            <DropdownMenuLabel className="tw-justify-center">我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="#" onClick={loginOut}>
                退出登录
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
