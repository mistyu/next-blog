import type { FC } from 'react';

import { postApi } from '@/api/post';
import { SimplePaginate } from '@/app/_components/paginate/simple';

export const PostListPaginate: FC<{ limit: number; page: number }> = async ({ limit, page }) => {
  const result = await postApi.pageNumbers({ limit });
  if (!result.ok) return null;
  const { result: totalPages } = await result.json();
  return (
    <div className="tw-w-full tw-flex-none">
      <SimplePaginate totalPages={totalPages} currentPage={page} />
    </div>
  );
};
