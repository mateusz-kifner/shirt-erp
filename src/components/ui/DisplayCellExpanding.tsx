import { cn } from "@/utils/cn";
import { useHover, useMergedRef } from "@mantine/hooks";
import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";

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
    const { ref: hoveredRef, hovered } = useHover();
    const mergedRef = useMergedRef(hoveredRef, ref);
    return (
      <div
        className={cn(
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
          text-stone-800
          outline-none
          transition-all
          before:absolute
          before:inset-px
          before:-z-10
          before:rounded
          before:bg-white
          read-only:bg-transparent
          read-only:outline-none
          focus:border-sky-600 dark:text-stone-200
          dark:outline-none
          dark:before:bg-stone-800
          dark:read-only:bg-transparent
          dark:read-only:outline-none
          dark:focus:border-sky-600`,
          disabled ? "bg-transparent text-gray-500" : "",
          !focus && "hover:animate-border-from-bottom",
          className
        )}
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
        ref={mergedRef}
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
