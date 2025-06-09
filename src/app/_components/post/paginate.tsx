import type { FC } from 'react';

import { SimplePaginate } from '@/app/_components/paginate/simple';
import { fetchApi } from '@/libs/api';

export const PostListPaginate: FC<{ limit: number; page: number }> = async ({ limit, page }) => {
  const result = await fetchApi(async (c) =>
    c.api.posts['page-numbers'].$get({
      query: { limit: limit.toString() },
    }),
  );
  if (!result.ok) return null;
  const { result: totalPages } = await result.json();
  return (
    <div className="tw-mb-5 tw-w-full tw-flex-none">
      <SimplePaginate totalPages={totalPages} currentPage={page} />
    </div>
  );
};
