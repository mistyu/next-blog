'use client';

import type { FC, MouseEventHandler } from 'react';

import { isNil } from 'lodash';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import type { PostItem } from '@/server/post/type';

import { postApi } from '@/api/post';
import { useAuth } from '@/app/_components/auth/hooks';
import { useToast } from '@/app/_components/shadcn/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/_components/shadcn/ui/alert-dialog';
import { Button } from '@/app/_components/shadcn/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/_components/shadcn/ui/tooltip';

export const PostDelete: FC<{ item: PostItem }> = ({ item }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pedding, setPedding] = useState(false);
  const auth = useAuth();
  const changeOpen = useCallback((value: boolean) => {
    setOpen(value);
  }, []);

  const openDialog: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();
    changeOpen(true);
  }, []);

  const close: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();
    if (!pedding) setOpen(false);
  }, []);

  const deleteItem: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (e) => {
      e.preventDefault();
      setPedding(true);
      const result = await postApi.delete(item.id);
      if (!result.ok) {
        toast({
          variant: 'destructive',
          title: '删除失败',
          description: (await result.json()).message,
        });
      }
      setPedding(false);
      setOpen(false);
      // 删除文章后刷新页面
      router.refresh();
    },
    [item.id],
  );
  if (isNil(auth)) return null;
  return (
    <AlertDialog open={open} onOpenChange={changeOpen}>
      <AlertDialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={openDialog}>
                <Trash2 /> 删除
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>删除文章</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogContent onEscapeKeyDown={(event) => event.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>是否确认删除该文章？</AlertDialogTitle>
          <AlertDialogDescription>当前不支持软删除，删除文章后将无法恢复</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pedding} onClick={close}>
            取消
          </AlertDialogCancel>
          <AlertDialogAction onClick={deleteItem} disabled={pedding}>
            {pedding ? '删除中' : '确认'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
