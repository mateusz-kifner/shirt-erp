import { cn } from "@/utils/cn";
import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { displayCellVariants } from "./DisplayCell";

interface DisplayCellProps extends HTMLAttributes<HTMLDivElement> {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  children: React.ReactNode;
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
