'use client';

import type { FC } from 'react';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { useAuth } from '@/app/_components/auth/hooks';
import { Button } from '@/app/_components/shadcn/ui/button';
import { cn } from '@/app/_components/shadcn/utils';
import { useUrlQuery } from '@/libs/url';

export const PostCreateButton: FC<{ iconBtn?: boolean }> = ({ iconBtn = false }) => {
  const auth = useAuth();
  const urlQuery = useUrlQuery();
  return (
    auth && (
      <Suspense>
        <div className="tw-flex">
          <Button
            asChild
            className={cn('tw-ml-auto tw-justify-end', {
              'focus-visible:!tw-ring-0': !iconBtn,
              'tw-rounded-sm': !iconBtn,
              'tw-size-9': iconBtn,
            })}
            variant="outline"
          >
            <Link href={`/blog/create${urlQuery}`}>
              <Plus />
              {!iconBtn && '创建'}
            </Link>
          </Button>
        </div>
      </Suspense>
    )
  );
};
