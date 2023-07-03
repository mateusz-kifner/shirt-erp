import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface DisplayCellProps extends HTMLAttributes<HTMLDivElement> {
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
        className={twMerge(
          `relative
          flex
          h-11
          w-full
          resize-none
          items-center
          gap-2
          overflow-hidden 
          whitespace-pre-line
          break-words 
          rounded
          border
          border-solid
          bg-white
          px-2
          text-sm
          leading-normal
          text-gray-400
          outline-none
          read-only:bg-transparent 
          read-only:outline-none 
          focus:border-sky-600 
          dark:bg-stone-800
          dark:text-stone-600
          dark:outline-none
          dark:read-only:bg-transparent 
          dark:read-only:outline-none 
        dark:focus:border-sky-600`,
          className,
          disabled && " bg-transparent text-gray-500",
          focus
            ? "border-sky-600 dark:border-sky-600"
            : "border-gray-400 dark:border-stone-600",
          error && "border-red-500 dark:border-red-500"
        )}
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
  }
);

DisplayCell.displayName = "DisplayCell";

export default DisplayCell;
