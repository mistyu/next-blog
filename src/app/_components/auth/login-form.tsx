'use client';

import type { FC } from 'react';

import { isNil } from 'lodash';
import { Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/app/_components/shadcn/utils';

import { Button } from '../shadcn/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../shadcn/ui/form';
import { Input } from '../shadcn/ui/input';
import { AuthProtector } from './checking';
import { useAuth, useAuthLoginForm, useAuthLoginSubmitHandler } from './hooks';

const LoginForm: FC = () => {
  const auth = useAuth();
  const router = useRouter();
  const form = useAuthLoginForm();
  const [authEror, setAuthError] = useState<string | null>(null);
  const submitHandler = useAuthLoginSubmitHandler(setAuthError);

  useEffect(() => {
    if (!isNil(auth)) router.replace('/');
  }, [auth]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="!tw-mt-4 tw-space-y-3">
        {authEror && (
          <div
            className={cn(
              'tw-p-3 tw-rounded-md',
              'tw-bg-red-50 tw-border tw-border-red-200',
              'tw-text-sm tw-text-red-600',
              'tw-transition-all tw-duration-300',
            )}
          >
            {authEror}
          </div>
        )}

        <FormField
          control={form.control}
          name="credential"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="tw-relative">
                  <User className="tw-absolute tw-left-3 tw-top-1/2 tw-h-4 tw-w-4 -tw-translate-y-1/2 tw-transform tw-text-gray-500" />
                  <Input
                    {...field}
                    className="tw-pl-10"
                    autoComplete="credential"
                    placeholder="请输入用户名或邮箱地址"
                    disabled={form.formState.isSubmitting}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="tw-relative">
                  <Lock className="tw-absolute tw-left-3 tw-top-1/2 tw-h-4 tw-w-4 -tw-translate-y-1/2 tw-transform tw-text-gray-500" />
                  <Input
                    {...field}
                    className="tw-pl-10"
                    type="password"
                    autoComplete="password"
                    placeholder="请输入密码"
                    disabled={form.formState.isSubmitting}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} className="!tw-mt-5 tw-w-full">
          {form.formState.isSubmitting ? '登录中...' : '登录'}
        </Button>
      </form>
    </Form>
  );
};
export const AuthLoginForm: FC = () => (
  <AuthProtector>
    <LoginForm />
  </AuthProtector>
);
