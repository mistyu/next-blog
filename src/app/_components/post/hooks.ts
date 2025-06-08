'use client';

import type { Post } from '@prisma/client';
import type { DeepNonNullable } from 'utility-types';

import { zodResolver } from '@hookform/resolvers/zod';
import { isNil, trim } from 'lodash';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { createPostItem, updatePostItem } from '@/app/actions/post';

import type { PostCreateData, PostFormData, PostUpdateData } from './types';

import { useToast } from '../shadcn/hooks/use-toast';
import { generatePostFormValidator } from './form-validator';

/**
 * 生成react-form-hooks表单的状态
 * 目前仅传入默认数据参数到useForm,后续我们会增加一些zod验证等其它参数
 * @param params
 */
export const usePostActionForm = (params: { type: 'create' } | { type: 'update'; item: Post }) => {
  // 定义默认数据
  const defaultValues = useMemo(() => {
    if (params.type === 'create') {
      return {
        title: '文章标题',
        body: '文章内容',
        summary: '',
        slug: '',
        keywords: '',
        description: '',
      } as DeepNonNullable<PostCreateData>;
    }

    return {
      title: params.item.title,
      body: params.item.body,
      summary: isNil(params.item.summary) ? '' : params.item.summary,
      slug: isNil(params.item.slug) ? '' : params.item.slug,
      keywords: isNil(params.item.keywords) ? '' : params.item.keywords,
      description: isNil(params.item.description) ? '' : params.item.description,
    } as DeepNonNullable<PostUpdateData>;
  }, [params.type]);
  return useForm<DeepNonNullable<PostFormData>>({
    mode: 'all',
    resolver: zodResolver(
      generatePostFormValidator(params.type === 'update' ? params.item.id : undefined),
    ) as any,
    defaultValues,
  });
};
/**
 * 生成表单submit(提交)函数用于操作数据的钩子
 * @param params
 */
export const usePostFormSubmitHandler = (
  params: { type: 'create' } | { type: 'update'; id: string },
) => {
  const router = useRouter();
  const { toast } = useToast();
  return useCallback(
    async (data: PostFormData) => {
      let post: Post | null;
      for (const key of Object.keys(data) as Array<keyof PostFormData>) {
        const value = data[key];

        if (typeof value === 'string' && !trim(value, '')) {
          delete data[key];
        }
      }
      try {
        // 更新文章
        if (params.type === 'update') {
          post = await updatePostItem(params.id, data as PostUpdateData);
        }
        // 创建文章
        else {
          post = await createPostItem(data as PostCreateData);
        }
        // 创建或更新文章后跳转到文章详情页
        // 注意,这里不要用push,防止在详情页后退后返回到创建或编辑页面的弹出框
        if (!isNil(post)) router.replace(`/posts/${post.slug || post.id}`);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: '遇到服务器错误,请联系管理员处理',
          description: (error as Error).message,
        });
      }
    },
    [{ ...params }],
  );
};
