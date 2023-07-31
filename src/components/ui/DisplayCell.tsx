import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export const displayCellVariants = cva(
  `relative
  z-10
  flex
  min-h-[2.75rem]
  w-full
  resize-none
  items-center
  gap-2
  overflow-hidden
  whitespace-pre-line
  break-words
  rounded
  px-2
  text-sm
  leading-normal
  
  outline-none
  transition-all
  before:absolute
  before:inset-px
  before:-z-10
  before:rounded
  before:bg-white
  read-only:bg-transparent
  read-only:outline-none
  focus:border-sky-600 
  
  dark:outline-none
  dark:before:bg-stone-800
  dark:read-only:bg-transparent
  dark:read-only:outline-none
  dark:focus:border-sky-600`,
  {
    variants: {
      focus: {
        true: "",
        false:
          "hover:animate-border-from-bottom text-gray-400 dark:text-stone-600",
      },
      disabled: {
        true: "bg-transparent text-gray-500 before:inset-0",
        false: "",
      },
    },
    defaultVariants: {
      focus: false,
      disabled: false,
    },
  }
);

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
      style,
      ...moreProps
    } = props;
    return (
      <div
        className={cn(displayCellVariants({ focus, disabled }), className)}
        style={{
          background: focus
            ? error
              ? "#ef4444"
              : "#0284c7"
            : "radial-gradient(ellipse at top, #292524 0%, #292524 50%, rgba(0,0,0,0) 70%),radial-gradient(ellipse at bottom, #57534e 0%, #57534e 50%, rgba(0,0,0,0) 70%)",
          backgroundPosition: focus ? "top" : "top, bottom",
          backgroundRepeat: focus ? "no-repeat" : "no-repeat, no-repeat",
          ...style,
        }}
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
