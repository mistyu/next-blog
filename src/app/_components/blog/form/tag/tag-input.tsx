/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unstable-default-props */
'use client';

import type { VariantProps } from 'class-variance-authority';

import { isNil } from 'lodash';
import React, { useMemo } from 'react';
import { v4 } from 'uuid';

import { Button } from '@/app/_components/shadcn/ui/button';
import { Input } from '@/app/_components/shadcn/ui/input';
import { cn } from '@/app/_components/shadcn/utils';

import type { tagVariants } from './tag';

import { Autocomplete } from './autocomplete';
import { TagList } from './tag-list';
// import { CommandInput } from '../ui/command';

export enum Delimiter {
  Comma = ',',
  Enter = 'Enter',
}

type OmittedInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export interface Tag {
  id: string;
  text: string;
}

export interface TagInputStyleClassesProps {
  inlineTagsContainer?: string;
  tagPopover?: {
    popoverTrigger?: string;
    popoverContent?: string;
  };
  tagList?: {
    container?: string;
    sortableList?: string;
  };
  autoComplete?: {
    command?: string;
    popoverTrigger?: string;
    popoverContent?: string;
    commandList?: string;
    commandGroup?: string;
    commandItem?: string;
  };
  tag?: {
    body?: string;
    closeButton?: string;
  };
  input?: string;
  clearAllButton?: string;
}

export interface TagInputProps extends OmittedInputProps, VariantProps<typeof tagVariants> {
  placeholder?: string;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  autocompleteOptions?: Tag[];
  maxTags?: number;
  minTags?: number;
  readOnly?: boolean;
  disabled?: boolean;
  onTagAdd?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  allowDuplicates?: boolean;
  validateTag?: (tag: string) => boolean;
  delimiter?: Delimiter;
  showCount?: boolean;
  placeholderWhenFull?: string;
  sortTags?: boolean;
  delimiterList?: string[];
  truncate?: number;
  minLength?: number;
  maxLength?: number;
  value?: string | number | readonly string[] | { id: string; text: string }[];
  autocompleteFilter?: (option: string) => boolean;
  direction?: 'row' | 'column';
  onInputChange?: (value: string) => void;
  customTagRenderer?: (tag: Tag, isActiveTag: boolean) => React.ReactNode;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onTagClick?: (tag: Tag) => void;
  draggable?: boolean;
  inputFieldPosition?: 'bottom' | 'top';
  clearAll?: boolean;
  onClearAll?: () => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  restrictTagsToAutocompleteOptions?: boolean;
  activeTagIndex: number | null;
  setActiveTagIndex: React.Dispatch<React.SetStateAction<number | null>>;
  styleClasses?: TagInputStyleClassesProps;
  usePortal?: boolean;
  addOnPaste?: boolean;
  addTagsOnBlur?: boolean;
  generateTagId?: () => string;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>((props, ref) => {
  const {
    id,
    placeholder,
    tags,
    setTags,
    variant,
    size,
    shape,
    autocompleteOptions,
    maxTags,
    delimiter = Delimiter.Comma,
    onTagAdd,
    onTagRemove,
    allowDuplicates,
    showCount,
    validateTag,
    placeholderWhenFull = 'Max tags reached',
    sortTags,
    delimiterList,
    truncate,
    borderStyle,
    textCase,
    interaction,
    animation,
    textStyle,
    minLength,
    maxLength,
    direction = 'row',
    onInputChange,
    customTagRenderer,
    onFocus,
    onBlur,
    onTagClick,
    draggable = false,
    inputFieldPosition = 'bottom',
    clearAll = false,
    onClearAll,
    inputProps = {},
    restrictTagsToAutocompleteOptions,
    addTagsOnBlur = false,
    activeTagIndex,
    setActiveTagIndex,
    styleClasses = {},
    disabled = false,
    usePortal = false,
    addOnPaste = false,
    generateTagId = v4,
  } = props;

  const [inputValue, setInputValue] = React.useState('');
  const [tagCount, setTagCount] = React.useState(Math.max(0, tags.length));
  const inputRef = React.useRef<HTMLInputElement>(null);

  if (
    (maxTags !== undefined && maxTags < 0) ||
    (props.minTags !== undefined && props.minTags < 0)
  ) {
    console.warn('maxTags and minTags cannot be less than 0');
    // error
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (addOnPaste && newValue.includes(delimiter)) {
      const splitValues = newValue
        .split(delimiter)
        .map((v) => v.trim())
        .filter((v) => v);
      splitValues.forEach((value) => {
        if (!value) return; // Skip empty strings from split

        const newTagText = value.trim();

        // Check if the tag is in the autocomplete options if restrictTagsToAutocomplete is true
        if (
          restrictTagsToAutocompleteOptions &&
          !autocompleteOptions?.some((option) => option.text === newTagText)
        ) {
          console.warn('Tag not allowed as per autocomplete options');
          return;
        }

        if (validateTag && !validateTag(newTagText)) {
          console.warn('Invalid tag as per validateTag');
          return;
        }

        if (minLength && newTagText.length < minLength) {
          console.warn(`Tag "${newTagText}" is too short`);
          return;
        }

        if (maxLength && newTagText.length > maxLength) {
          console.warn(`Tag "${newTagText}" is too long`);
          return;
        }

        const newTagId = generateTagId();

        // Add tag if duplicates are allowed or tag does not already exist
        if (allowDuplicates || !tags.some((tag) => tag.text === newTagText)) {
          if (maxTags === undefined || tags.length < maxTags) {
            // Check for maxTags limit
            const newTag = { id: newTagId, text: newTagText };
            setTags((prevTags) => [...prevTags, newTag]);
            onTagAdd?.(newTagText);
          } else {
            console.warn('Reached the maximum number of tags allowed');
          }
        } else {
          console.warn(`Duplicate tag "${newTagText}" not added`);
        }
      });
      setInputValue('');
    } else {
      setInputValue(newValue);
    }
    onInputChange?.(newValue);
  };

  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setActiveTagIndex(null); // Reset active tag index when the input field gains focus
    onFocus?.(event);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (addTagsOnBlur && inputValue.trim()) {
      const newTagText = inputValue.trim();

      if (validateTag && !validateTag(newTagText)) {
        return;
      }

      if (minLength && newTagText.length < minLength) {
        console.warn('Tag is too short');
        return;
      }

      if (maxLength && newTagText.length > maxLength) {
        console.warn('Tag is too long');
        return;
      }

      if (
        (allowDuplicates || !tags.some((tag) => tag.text === newTagText)) &&
        (maxTags === undefined || tags.length < maxTags)
      ) {
        const newTagId = generateTagId();
        setTags([...tags, { id: newTagId, text: newTagText }]);
        onTagAdd?.(newTagText);
        setTagCount((prevTagCount) => prevTagCount + 1);
        setInputValue('');
      }
    }

    onBlur?.(event);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      delimiterList
        ? delimiterList.includes(e.key)
        : e.key === delimiter || e.key === Delimiter.Enter
    ) {
      e.preventDefault();
      const newTagText = inputValue.trim();

      // Check if the tag is in the autocomplete options if restrictTagsToAutocomplete is true
      if (
        restrictTagsToAutocompleteOptions &&
        !autocompleteOptions?.some((option) => option.text === newTagText)
      ) {
        // error
        return;
      }

      if (validateTag && !validateTag(newTagText)) {
        return;
      }

      if (minLength && newTagText.length < minLength) {
        console.warn('Tag is too short');
        // error
        return;
      }

      // Validate maxLength
      if (maxLength && newTagText.length > maxLength) {
        // error
        console.warn('Tag is too long');
        return;
      }

      const newTagId = generateTagId();

      if (
        newTagText &&
        (allowDuplicates || !tags.some((tag) => tag.text === newTagText)) &&
        (maxTags === undefined || tags.length < maxTags)
      ) {
        setTags([...tags, { id: newTagId, text: newTagText }]);
        onTagAdd?.(newTagText);
        setTagCount((prevTagCount) => prevTagCount + 1);
      }
      setInputValue('');
    } else {
      switch (e.key) {
        case 'Delete':
          if (activeTagIndex !== null) {
            e.preventDefault();
            const newTags = [...tags];
            newTags.splice(activeTagIndex, 1);
            setTags(newTags);
            setActiveTagIndex((prev) =>
              newTags.length === 0 ? null : prev! >= newTags.length ? newTags.length - 1 : prev,
            );
            setTagCount((prevTagCount) => prevTagCount - 1);
            onTagRemove?.(tags[activeTagIndex].text);
          }
          break;
        case 'Backspace':
          if (activeTagIndex !== null) {
            e.preventDefault();
            const newTags = [...tags];
            newTags.splice(activeTagIndex, 1);
            setTags(newTags);
            setActiveTagIndex((prev) => (prev! === 0 ? null : prev! - 1));
            setTagCount((prevTagCount) => prevTagCount - 1);
            onTagRemove?.(tags[activeTagIndex].text);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (activeTagIndex === null) {
            setActiveTagIndex(0);
          } else {
            setActiveTagIndex((prev) => (prev! + 1 >= tags.length ? 0 : prev! + 1));
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (activeTagIndex === null) {
            setActiveTagIndex(tags.length - 1);
          } else {
            setActiveTagIndex((prev) => (prev! === 0 ? tags.length - 1 : prev! - 1));
          }
          break;
        case 'Home':
          e.preventDefault();
          setActiveTagIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setActiveTagIndex(tags.length - 1);
          break;
      }
    }
  };

  const removeTag = (idToRemove: string) => {
    setTags(tags.filter((tag) => tag.id !== idToRemove));
    onTagRemove?.(tags.find((tag) => tag.id === idToRemove)?.text || '');
    setTagCount((prevTagCount) => prevTagCount - 1);
  };

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setTags((currentTags) => {
      const newTags = [...currentTags];
      const [removedTag] = newTags.splice(oldIndex, 1);
      newTags.splice(newIndex, 0, removedTag);

      return newTags;
    });
  };

  const handleClearAll = () => {
    if (!onClearAll) {
      setActiveTagIndex(-1);
      setTags([]);
      return;
    }
    onClearAll?.();
  };

  // const filteredAutocompleteOptions = autocompleteFilter
  //   ? autocompleteOptions?.filter((option) => autocompleteFilter(option.text))
  //   : autocompleteOptions;
  const filteredAutocompleteOptions = useMemo(() => {
    if (isNil(inputValue) || inputValue.length <= 0) return [];
    return (autocompleteOptions || []).filter((option) =>
      option.text.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [inputValue, autocompleteOptions]);

  const displayedTags = sortTags ? [...tags].sort() : tags;

  const truncatedTags = truncate
    ? tags.map((tag) => ({
        id: tag.id,
        text: tag.text?.length > truncate ? `${tag.text.substring(0, truncate)}...` : tag.text,
      }))
    : displayedTags;

  return (
    <div
      className={`tw-flex tw-w-full  ${
        inputFieldPosition === 'bottom'
          ? 'tw-flex-col'
          : inputFieldPosition === 'top'
            ? 'tw-flex-col-reverse'
            : 'tw-flex-row'
      }`}
    >
      <div className="tw-w-full">
        <Autocomplete
          tags={tags}
          setTags={setTags}
          setInputValue={setInputValue}
          autocompleteOptions={filteredAutocompleteOptions as Tag[]}
          setTagCount={setTagCount}
          maxTags={maxTags}
          onTagAdd={onTagAdd}
          onTagRemove={onTagRemove}
          allowDuplicates={allowDuplicates ?? false}
          usePortal={usePortal}
          classStyleProps={{
            command: styleClasses?.autoComplete?.command,
            popoverTrigger: styleClasses?.autoComplete?.popoverTrigger,
            popoverContent: styleClasses?.autoComplete?.popoverContent,
            commandList: styleClasses?.autoComplete?.commandList,
            commandGroup: styleClasses?.autoComplete?.commandGroup,
            commandItem: styleClasses?.autoComplete?.commandItem,
          }}
        >
          <div
            className={cn(
              `tw-flex tw-flex-row tw-flex-wrap tw-items-center tw-p-0 tw-gap-0 tw-h-fit tw-w-full tw-space-x-2
                                    tw-text-sm file:tw-border-0 file:tw-bg-transparent file:tw-text-sm file:tw-font-medium placeholder:tw-text-muted-foreground focus-visible:tw-outline-none
                                    focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50`,
              styleClasses?.inlineTagsContainer,
            )}
          >
            <TagList
              tags={truncatedTags}
              customTagRenderer={customTagRenderer}
              variant={variant}
              size={size}
              shape={shape}
              borderStyle={borderStyle}
              textCase={textCase}
              interaction={interaction}
              animation={animation}
              textStyle={textStyle}
              onTagClick={onTagClick}
              draggable={draggable}
              onSortEnd={onSortEnd}
              onRemoveTag={removeTag}
              direction={direction}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
              classStyleProps={{
                tagListClasses: styleClasses?.tagList,
                tagClasses: styleClasses?.tag,
              }}
              disabled={disabled}
            />
            <Input
              ref={inputRef}
              id={id}
              type="text"
              placeholder={
                maxTags !== undefined && tags.length >= maxTags ? placeholderWhenFull : placeholder
              }
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              {...inputProps}
              className={cn(
                'tw-border-0 tw-h-5 tw-bg-transparent focus-visible:tw-ring-0 focus-visible:tw-ring-transparent focus-visible:tw-ring-offset-0 tw-flex-1 tw-w-fit',
                // className,
                styleClasses?.input,
              )}
              autoComplete="on"
              list="autocomplete-options"
              disabled={disabled || (maxTags !== undefined && tags.length >= maxTags)}
            />
          </div>
        </Autocomplete>
      </div>

      {showCount && maxTags && (
        <div className="tw-flex">
          <span className="tw-ml-auto tw-mt-1 tw-text-sm tw-text-muted-foreground">
            {`${tagCount}`}/{`${maxTags}`}
          </span>
        </div>
      )}
      {clearAll && (
        <Button
          type="button"
          onClick={handleClearAll}
          className={cn('tw-mt-2', styleClasses?.clearAllButton)}
        >
          Clear All
        </Button>
      )}
    </div>
  );
});

TagInput.displayName = 'TagInput';

export { TagInput };
