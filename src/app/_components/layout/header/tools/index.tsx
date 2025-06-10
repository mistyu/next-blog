import type { FC } from 'react';

import { Loader2 } from 'lucide-react';

import { AuthProtector } from '@/app/_components/auth/checking';
import { Button } from '@/app/_components/shadcn/ui/button';

import { ApiDocButton } from './api-doc';
import { PostCreateButton } from './post-create';
import { ThemeChangeButton } from './theme-change';
import { UserActionButton } from './user-action';
export const HeaderTools: FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
  <div className="tw-flex tw-items-center tw-justify-end tw-space-x-2">
    <AuthProtector>
      <PostCreateButton iconBtn={isMobile} />
    </AuthProtector>
    <ApiDocButton />
    <ThemeChangeButton />
    <AuthProtector
      loading={
        <Button disabled className="tw-ml-auto tw-size-9 tw-justify-end" variant="outline">
          <Loader2 className="tw-animate-spin" />
        </Button>
      }
    >
      <UserActionButton />
    </AuthProtector>
  </div>
);
