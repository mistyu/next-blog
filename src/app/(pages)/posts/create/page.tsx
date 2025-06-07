import type { FC } from 'react';

import { PostCreateForm } from './form';
import $styles from './style.module.css';

// 添加动态标记，强制使用 SSR
export const dynamic = 'force-dynamic';
// export const fetchCache = 'force-no-store';

const PostCreatePage: FC = async () => {
  return (
    <div className="tw-page-container">
      <div className={$styles.item}>
        <PostCreateForm />
      </div>
    </div>
  );
};
export default PostCreatePage;
