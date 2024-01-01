import { cn } from "@/utils/cn";
import React, { type ComponentProps, forwardRef, type ReactNode } from "react";
import { displayCellVariants } from "./DisplayCell";

interface DisplayCellProps extends ComponentProps<"div"> {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  children: ReactNode;
  focus?: boolean;
  disabled?: boolean;
  error?: boolean;
}

const DisplayCellExpanding = forwardRef<HTMLDivElement, DisplayCellProps>(
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
          <div className="flex flex-grow items-center text-stone-800 dark:text-stone-200">
            {children}
          </div>
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
  },
);

DisplayCellExpanding.displayName = "DisplayCellExpanding";

export default DisplayCellExpanding;
