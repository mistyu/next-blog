'use client';

import type { FC } from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import type { CategoryList } from '@/server/category/type';

import { Button } from '@/app/_components/shadcn/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/app/_components/shadcn/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/_components/shadcn/ui/popover';
import { cn } from '@/app/_components/shadcn/utils';
interface CategorySelectProps {
  categories: CategoryList;
  setValue: (value: string) => void;
  value: string;
}

export const CategorySelect: FC<CategorySelectProps> = (props) => {
  const { categories, value, setValue } = props;
  const [open, setOpen] = useState(false);
  const triggerContainerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverContentRef = useRef<HTMLDivElement | null>(null);

  const [popoverWidth, setPopoverWidth] = useState<number>(0);
  const handleOpenChange = useCallback((open: boolean) => {
    if (open && triggerContainerRef.current) {
      const { width } = triggerContainerRef.current.getBoundingClientRect();
      setPopoverWidth(width);
    }
    setOpen(open);
  }, []);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <div
        className="tw-relative tw-flex tw-items-center tw-rounded-md tw-border tw-bg-transparent"
        ref={triggerContainerRef}
      >
        <PopoverTrigger asChild ref={triggerRef}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="tw-mr-0 tw-flex tw-h-full tw-w-full tw-justify-between tw-border-0 tw-bg-transparent tw-shadow-none tw-ring-0 hover:!tw-bg-transparent focus-visible:!tw-ring-0"
          >
            {value ? categories.find((item) => item.id === value)?.name : '选择分类...'}
            <ChevronsUpDown className="tw-opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        ref={popoverContentRef}
        side="bottom"
        align="start"
        forceMount
        className={cn(`tw-p-0 tw-relative`)}
        style={{
          width: `${popoverWidth}px`,
          minWidth: `${popoverWidth}px`,
          zIndex: 39,
        }}
      >
        <Command>
          <CommandInput placeholder="选择分类..." className="tw-h-9" />
          <CommandList>
            <CommandEmpty>无分类可选</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="null"
                value=""
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
              >
                不选择
                <Check
                  className={cn('tw-ml-auto', value === '' ? 'tw-opacity-100' : 'tw-opacity-0')}
                />
              </CommandItem>
              {categories.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {`${'- '.repeat(item.depth - 1)}${item.name}`}
                  <Check
                    className={cn(
                      'tw-ml-auto',
                      value === item.id ? 'tw-opacity-100' : 'tw-opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
