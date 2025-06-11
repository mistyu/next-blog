/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import SortableList, { SortableItem } from 'react-easy-sort';

import { cn } from '@/app/_components/shadcn/utils';

import type { TagProps } from './tag';
import type { TagInputStyleClassesProps, Tag as TagType } from './tag-input';

import { Tag } from './tag';

export type TagListProps = {
  tags: TagType[];
  customTagRenderer?: (tag: TagType, isActiveTag: boolean) => React.ReactNode;
  direction?: TagProps['direction'];
  onSortEnd: (oldIndex: number, newIndex: number) => void;
  className?: string;
  activeTagIndex?: number | null;
  setActiveTagIndex?: (index: number | null) => void;
  classStyleProps: {
    tagListClasses: TagInputStyleClassesProps['tagList'];
    tagClasses: TagInputStyleClassesProps['tag'];
  };
  disabled?: boolean;
} & Omit<TagProps, 'tagObj'>;

const DropTarget: React.FC = () => {
  return <div className={cn('tw-h-full tw-rounded-md tw-bg-secondary/50')} />;
};

export const TagList: React.FC<TagListProps> = ({
  tags,
  customTagRenderer,
  direction,
  draggable,
  onSortEnd,
  className,
  activeTagIndex,
  setActiveTagIndex,
  classStyleProps,
  disabled,
  ...tagListProps
}) => {
  const [draggedTagId, setDraggedTagId] = React.useState<string | null>(null);

  const handleMouseDown = (id: string) => {
    setDraggedTagId(id);
  };

  const handleMouseUp = () => {
    setDraggedTagId(null);
  };

  return (
    <>
      {draggable ? (
        <SortableList
          onSortEnd={onSortEnd}
          className="list tw-flex tw-flex-wrap tw-gap-2"
          dropTarget={<DropTarget />}
        >
          {tags.map((tagObj, index) => (
            <SortableItem key={tagObj.id}>
              <div
                onMouseDown={() => handleMouseDown(tagObj.id)}
                onMouseLeave={handleMouseUp}
                className={cn(
                  {
                    'tw-border tw-border-solid tw-border-primary tw-rounded-md':
                      draggedTagId === tagObj.id,
                  },
                  'tw-transition-all tw-duration-200 tw-ease-in-out',
                )}
              >
                {customTagRenderer ? (
                  customTagRenderer(tagObj, index === activeTagIndex)
                ) : (
                  <Tag
                    tagObj={tagObj}
                    isActiveTag={index === activeTagIndex}
                    direction={direction}
                    draggable={draggable}
                    tagClasses={classStyleProps?.tagClasses}
                    {...tagListProps}
                    disabled={disabled}
                  />
                )}
              </div>
            </SortableItem>
          ))}
        </SortableList>
      ) : (
        tags.map((tagObj, index) =>
          customTagRenderer ? (
            customTagRenderer(tagObj, index === activeTagIndex)
          ) : (
            <Tag
              key={tagObj.id}
              tagObj={tagObj}
              isActiveTag={index === activeTagIndex}
              direction={direction}
              draggable={draggable}
              tagClasses={classStyleProps?.tagClasses}
              {...tagListProps}
              disabled={disabled}
            />
          ),
        )
      )}
    </>
  );
};
