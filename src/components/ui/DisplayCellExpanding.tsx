import { cn } from "@/utils/cn";
import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";

interface DisplayCellProps extends HTMLAttributes<HTMLDivElement> {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  children: React.ReactNode;
  focus?: boolean;
  disabled?: boolean;
}

const DisplayCellExpanding = forwardRef<HTMLDivElement, DisplayCellProps>(
  (props, ref) => {
    const {
      leftSection,
      rightSection,
      children,
      disabled = false,
      focus = false,
      className,
      ...moreProps
    } = props;
    return (
      <div
        className={cn(
          `before:inset
          relative
          flex
          min-h-[2.75rem]
          w-full
          resize-none
          items-center
          gap-2
          overflow-hidden 
          whitespace-pre-line
          break-words
          border
          border-b
          border-solid
          border-transparent
          bg-white
          px-2
          text-sm
          leading-normal
          text-stone-800 
          outline-none
          transition-all
         
          read-only:bg-transparent 
          read-only:outline-none 
          hover:rounded
        focus:border-sky-600
        dark:bg-stone-800
        dark:text-stone-200
        dark:outline-none
        dark:read-only:bg-transparent
        dark:read-only:outline-none
        dark:focus:border-sky-600`,
          disabled ? " bg-transparent text-gray-500" : "",
          focus
            ? "rounded border-sky-600 dark:border-sky-600"
            : "border-b-gray-400 hover:border-gray-400 dark:border-b-stone-600 dark:hover:border-stone-600",
          className
        )}
        {...moreProps}
        ref={ref}
      >
        <div className="flex flex-grow items-center gap-2">
          {!!leftSection && (
            <div
              className="
          text-gray-400 
          dark:text-stone-600"
            >
              {leftSection}
            </div>
          )}
          <div className="flex flex-grow items-center">{children}</div>
        </div>
        {!!rightSection && (
          <div
            className="
        text-gray-400 
        dark:text-stone-600"
          >
            {rightSection}
          </div>
        )}
      </div>
    );
  }
);

DisplayCellExpanding.displayName = "DisplayCellExpanding";

export default DisplayCellExpanding;
