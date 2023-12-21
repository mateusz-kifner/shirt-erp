import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import React, { forwardRef, type ComponentProps, type ReactNode } from "react";

export const displayCellVariants = cva(
  `flex
  h-10
  w-full
  rounded-md
  border
  border-input
  bg-background
  px-3
  text-sm
  ring-offset-background
  file:border-0
  file:bg-transparent
  file:text-sm
  file:font-medium
  placeholder:text-muted-foreground
  focus-within:outline-none
  focus-within:ring-1
  focus-within:ring-ring
  disabled:cursor-not-allowed
  disabled:opacity-50
  disabled:bg-transparent 
  disabled:text-gray-500
  dark:disabled:cursor-not-allowed
  whitespace-pre-line
  gap-2
  items-center
  `,

  {
    variants: {},
    defaultVariants: {},
  },
);

interface DisplayCellProps extends ComponentProps<"div"> {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  children: React.ReactNode;
  focus?: boolean;
  disabled?: boolean;
  error?: boolean;
}

const DisplayCell = forwardRef<HTMLDivElement, DisplayCellProps>(
  (props, ref) => {
    const {
      leftSection,
      rightSection,
      children,
      disabled = false,
      focus = false,
      error = false,
      className,
      ...moreProps
    } = props;
    return (
      <div
        className={cn(displayCellVariants(), className)}
        {...moreProps}
        ref={ref}
      >
        {!!leftSection && leftSection}
        <div className="flex flex-grow items-center text-stone-800 dark:text-stone-200">
          {children}
        </div>
        {!!rightSection && rightSection}
      </div>
    );
  },
);

DisplayCell.displayName = "DisplayCell";

export default DisplayCell;
