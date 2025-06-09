'use client';

import type { Post } from '@prisma/client';
import type { DeepNonNullable } from 'utility-types';

import { zodResolver } from '@hookform/resolvers/zod';
import { isNil, trim } from 'lodash';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import type { PostCreateOrUpdateData, PostItem } from '@/server/post/type';

import { fetchApi } from '@/libs/api';
import { getPostItemRequestSchema } from '@/server/post/schema';

import type { PostUpdateData } from './types';

import { useToast } from '../shadcn/hooks/use-toast';

/**
 * slug唯一性验证函数
 * slug创建和编辑文章时，如果slug已经被占用且不是当前文章（编辑文章）的slug时，验证失败
 * 在编辑文章时，如果slug已被占用，但是当前编辑的文章的slug，则不报错
 * @param id
 */
export const isSlugUniqueForFrontend = (id?: string) => async (val?: string | null) => {
  if (isNil(val) || !val.length) return true;
  const result = await fetchApi(async (c) =>
    c.api.posts.byslug[':slug'].$get({ param: { slug: val } }),
  );
  if (!result.ok) return false;
  const post = (await result.json()) as any;
  if (isNil(post) || post.id === id) return true;
  return false;
};

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
      } as DeepNonNullable<PostCreateOrUpdateData>;
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
  return useForm<DeepNonNullable<PostCreateOrUpdateData>>({
    mode: 'all',
    resolver: zodResolver(
      getPostItemRequestSchema(
        isSlugUniqueForFrontend(params.type === 'update' ? params.item.id : undefined),
      ),
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
    async (data: PostCreateOrUpdateData) => {
      let post: PostItem | null;
      for (const key of Object.keys(data) as Array<keyof PostCreateOrUpdateData>) {
        const value = data[key];

        if (typeof value === 'string' && !trim(value, '')) {
          delete data[key];
        }
      }
      try {
        // 更新文章
        if (params.type === 'update') {
          const res = await fetchApi(async (c) =>
            c.api.posts[':id'].$patch({
              param: { id: params.id },
              // json: data,
            }),
          );
          if (!res.ok) throw new Error((await res.json()).message);
          post = (await res.json()) as any as PostItem;
        }
        // 创建文章
        else {
          const res = await fetchApi(async (c) => c.api.posts.$post({ json: data }));
          if (!res.ok) throw new Error((await res.json()).message);
          post = (await res.json()) as any as PostItem;
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
