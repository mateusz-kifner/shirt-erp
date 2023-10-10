import { type ComponentProps, forwardRef, type ReactNode } from "react";

import { cn } from "@/utils/cn";
import DisplayCell from "./DisplayCell";

export interface InputProps extends ComponentProps<"input"> {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  focus?: boolean;
  displayCellClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      displayCellClassName,
      leftSection,
      rightSection,
      focus,
      type,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <DisplayCell
        leftSection={leftSection}
        rightSection={rightSection}
        focus={focus}
        disabled={disabled}
        className={displayCellClassName}
      >
        <input
          type={type}
          className={cn(
            `
            data-disabled:text-gray-500
            dark:data-disabled:text-gray-500
            w-full
            resize-none
            overflow-hidden
            whitespace-pre-line 
            break-words
            bg-transparent
            py-3
            text-sm
            outline-none
            focus-visible:border-transparent
            focus-visible:outline-none`,
            className,
            disabled && "cursor-not-allowed",
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
      </DisplayCell>
    );
  },
);
Input.displayName = "Input";

export { Input };
