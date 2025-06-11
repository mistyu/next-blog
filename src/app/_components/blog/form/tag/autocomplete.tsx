/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-clone-element */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/app/_components/shadcn/ui/popover';
import { cn } from '@/app/_components/shadcn/utils';

// import { Command, CommandList, CommandItem, CommandGroup, CommandEmpty } from '../ui/command';
import type { TagInputStyleClassesProps, Tag as TagType } from './tag-input';

interface AutocompleteProps {
  tags: TagType[];
  setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setTagCount: React.Dispatch<React.SetStateAction<number>>;
  autocompleteOptions: TagType[];
  maxTags?: number;
  onTagAdd?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  allowDuplicates: boolean;
  children: React.ReactNode;
  classStyleProps: TagInputStyleClassesProps['autoComplete'];
  usePortal?: boolean;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  tags,
  setTags,
  setInputValue,
  setTagCount,
  autocompleteOptions,
  maxTags,
  onTagAdd,
  onTagRemove,
  allowDuplicates,
  children,
  classStyleProps,
}) => {
  const triggerContainerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const popoverContentRef = useRef<HTMLDivElement | null>(null);

  const [popoverWidth, setPopoverWidth] = useState<number>(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [popooverContentTop, setPopoverContentTop] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Dynamically calculate the top position for the popover content
  useEffect(() => {
    if (!triggerContainerRef.current || !triggerRef.current) return;
    setPopoverContentTop(
      triggerContainerRef.current?.getBoundingClientRect().bottom -
        triggerRef.current?.getBoundingClientRect().bottom,
    );
  }, [tags]);

  // Close the popover when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
    ) => {
      if (
        isPopoverOpen &&
        triggerContainerRef.current &&
        popoverContentRef.current &&
        !triggerContainerRef.current.contains(event.target as Node) &&
        !popoverContentRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isPopoverOpen]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open && triggerContainerRef.current) {
        const { width } = triggerContainerRef.current.getBoundingClientRect();
        setPopoverWidth(width);
      }

      if (open) {
        inputRef.current?.focus();
        setIsPopoverOpen(open);
      }
    },
    [inputFocused],
  );

  const handleInputFocus = (
    event: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>,
  ) => {
    if (triggerContainerRef.current) {
      const { width } = triggerContainerRef.current.getBoundingClientRect();
      setPopoverWidth(width);
      setIsPopoverOpen(true);
    }

    // Only set inputFocused to true if the popover is already open.
    // This will prevent the popover from opening due to an input focus if it was initially closed.
    if (isPopoverOpen) {
      setInputFocused(true);
    }

    const userOnFocus = (children as React.ReactElement<any>).props.onFocus;
    if (userOnFocus) userOnFocus(event);
  };

  const handleInputBlur = (
    event: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>,
  ) => {
    setInputFocused(false);

    // Allow the popover to close if no other interactions keep it open
    if (!isPopoverOpen) {
      setIsPopoverOpen(false);
    }

    const userOnBlur = (children as React.ReactElement<any>).props.onBlur;
    if (userOnBlur) userOnBlur(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isPopoverOpen) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex <= 0 ? autocompleteOptions.length - 1 : prevIndex - 1,
        );
        break;
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex === autocompleteOptions.length - 1 ? 0 : prevIndex + 1,
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex !== -1) {
          toggleTag(autocompleteOptions[selectedIndex]);
          setSelectedIndex(-1);
        }
        break;
    }
  };

  const toggleTag = (option: TagType) => {
    // Check if the tag already exists in the array
    const index = tags.findIndex((tag) => tag.text === option.text);

    if (index >= 0) {
      // Tag exists, remove it
      const newTags = tags.filter((_, i) => i !== index);
      setTags(newTags);
      setTagCount((prevCount) => prevCount - 1);
      if (onTagRemove) {
        onTagRemove(option.text);
      }
    } else {
      // Tag doesn't exist, add it if allowed
      if (!allowDuplicates && tags.some((tag) => tag.text === option.text)) {
        // If duplicates aren't allowed and a tag with the same text exists, do nothing
        return;
      }

      // Add the tag if it doesn't exceed max tags, if applicable
      if (!maxTags || tags.length < maxTags) {
        setTags([...tags, option]);
        setTagCount((prevCount) => prevCount + 1);
        setInputValue('');
        if (onTagAdd) {
          onTagAdd(option.text);
        }
      }
    }
    setSelectedIndex(-1);
  };

  const childrenWithProps = React.cloneElement(children as React.ReactElement<any>, {
    onKeyDown: handleKeyDown,
    onFocus: handleInputFocus,
    onBlur: handleInputBlur,
    ref: inputRef,
  });

  return (
    <div
      className={cn(
        'tw-flex tw-h-full tw-w-full tw-flex-col tw-overflow-hidden tw-rounded-md tw-bg-transparent tw-text-popover-foreground',
        classStyleProps?.command,
      )}
    >
      <Popover open={isPopoverOpen} onOpenChange={handleOpenChange} modal={false}>
        <div
          className="tw-relative tw-flex tw-h-full tw-items-center tw-rounded-md tw-border tw-bg-transparent"
          ref={triggerContainerRef}
        >
          {childrenWithProps}
          <PopoverTrigger asChild ref={triggerRef}>
            <div className={cn('tw-w-0 tw-h-full tw-mr-0', classStyleProps?.popoverTrigger)}></div>
          </PopoverTrigger>
        </div>
        {autocompleteOptions.length > 0 && (
          <PopoverContent
            ref={popoverContentRef}
            side="bottom"
            align="start"
            forceMount
            className={cn(`tw-p-0 tw-relative`, classStyleProps?.popoverContent)}
            style={{
              top: `calc(${popooverContentTop}px - 5px)`,
              marginLeft: `calc(-${popoverWidth}px)`,
              width: `${popoverWidth}px`,
              minWidth: `${popoverWidth}px`,
              zIndex: 9999,
            }}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            // onPointerDownOutside={(e) => {
            //     const target = e.target as Node;
            //     if (inputRef.current?.contains(target)) {
            //         e.preventDefault();
            //     }
            // }}
          >
            <div
              className={cn(
                'tw-max-h-80 tw-overflow-y-auto tw-overflow-x-hidden',
                classStyleProps?.commandList,
              )}
              // style={{
              //     minHeight: '16rem',
              // }}
              key={autocompleteOptions.length}
            >
              <div
                key={autocompleteOptions.length}
                role="group"
                className={cn(
                  'tw-overflow-y-auto tw-overflow-hidden tw-p-1 tw-text-foreground',
                  classStyleProps?.commandGroup,
                )}
                style={{
                  minHeight: '68px',
                }}
              >
                <div role="separator" className="tw-py-0.5" />
                {autocompleteOptions.map((option, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={option.id}
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        'tw-relative tw-flex tw-cursor-pointer tw-select-none tw-items-center tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none tw-aria-selected:bg-accent tw-aria-selected:text-accent-foreground tw-data-[disabled]:pointer-events-none tw-data-[disabled]:opacity-50 tw-hover:bg-accent',
                        isSelected && 'tw-bg-accent tw-text-accent-foreground',
                        classStyleProps?.commandItem,
                      )}
                      data-value={option.text}
                      onClick={() => toggleTag(option)}
                    >
                      <div className="tw-flex tw-w-full tw-items-center tw-gap-2">
                        {option.text}
                        {tags.some((tag) => tag.text === option.text) && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="tw-lucide tw-lucide-check"
                          >
                            <path d="M20 6 9 17l-5-5"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
};
