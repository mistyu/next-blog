'use client';

import type { FC } from 'react';

import { isNil } from 'lodash';
import { UserPen } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import type { PostItem } from '@/server/post/type';

import { useAuth } from '@/app/_components/auth/hooks';
import { Button as CNButton } from '@/app/_components/shadcn/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/_components/shadcn/ui/tooltip';
import { useUrlQuery } from '@/libs/url';

const Button: FC<{ id: string }> = ({ id }) => {
  const urlQuery = useUrlQuery();
  return (
    <CNButton asChild variant="outline" size="sm">
      <Link href={`/blog/edit/${id}${urlQuery}`}>
        <UserPen /> 编辑
      </Link>
    </CNButton>
  );
};

export const PostEditButton: FC<{ item: PostItem }> = ({ item }) => {
  const auth = useAuth();
  if (isNil(auth)) return null;
  return (
    <Suspense>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button id={item.id} />
          </TooltipTrigger>
          <TooltipContent>
            <p>编辑文章</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Suspense>
  );
};
