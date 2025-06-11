'use client';

import type { FC } from 'react';

import { FileIcon, FolderIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';

import type { CategoryItem, CategoryTree } from '@/server/category/type';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/_components/shadcn/ui/accordion';
import { cn } from '@/app/_components/shadcn/utils';

import $styles from './tree.module.css';

interface CategoryItemProps {
  category: CategoryItem;
  actives: string[];
  parentPath: string;
}

const Item: FC<CategoryItemProps> = ({ category, actives, parentPath }) => {
  const hasChildren = category.children && category.children.length > 0;
  const isActive =
    actives.includes(category.id) && !(category.children ?? []).some((c) => actives.includes(c.id));
  const itemRef = useRef<HTMLDivElement>(null);
  const currentPath = useMemo(
    () => `${parentPath}/${category.slug || category.id}`,
    [parentPath, category.slug, category.id],
  );

  // 滚动到视图
  useEffect(() => {
    if (isActive && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isActive]);

  if (hasChildren) {
    return (
      <AccordionItem value={category.id} className="tw-border-none" data-active={isActive}>
        <div ref={itemRef} className={cn($styles.folderItem, isActive && $styles.active)}>
          <div
            className={$styles.folderLink}
            style={{ paddingLeft: `${0.5 * (category.depth - 1)}rem` }}
          >
            <FolderIcon className="tw-mr-2 tw-h-4 tw-w-4" />
            <AccordionTrigger
              className="tw-flex tw-flex-1 tw-py-0 tw-font-medium hover:tw-no-underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                className="tw-ellips tw-animate-decoration tw-animate-decoration-sm tw-mr-2"
                href={currentPath}
              >
                {category.name}
              </Link>
            </AccordionTrigger>
          </div>
        </div>
        <AccordionContent className="!tw-pb-0">
          <div className={$styles.children}>
            {category.children?.map((child) => (
              <Item key={child.id} category={child} actives={actives} parentPath={currentPath} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <div ref={itemRef} className={cn($styles.item, isActive && $styles.active)}>
      <div className={$styles.itemLink} style={{ paddingLeft: `${0.5 * (category.depth - 1)}rem` }}>
        <FileIcon className="tw-mr-2 tw-h-4 tw-w-4" />
        {/* <span className="tw-font-medium">{category.name}</span> */}
        <Link
          key={category.id}
          href={currentPath}
          className="tw-ellips tw-animate-decoration tw-animate-decoration-sm"
        >
          {category.name}
        </Link>
      </div>
    </div>
  );
};

export const CategoryTreeComponent: FC<{ categories: CategoryTree; actives: string[] }> = ({
  categories,
  actives,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className={cn($styles.container)}>
      <Accordion type="multiple" className={$styles.accordion} defaultValue={actives}>
        {categories.map((category) => (
          <Item key={category.id} category={category} actives={actives} parentPath="/blog" />
        ))}
      </Accordion>
    </div>
  );
};
