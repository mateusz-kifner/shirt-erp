import { useClipboard } from "@mantine/hooks";
import * as LabelPrimitive from "@radix-ui/react-label";
import { IconCopy, IconQuestionMark } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  ReactNode,
  forwardRef,
} from "react";

import { toast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import Button from "./Button";
import SimpleTooltip from "./SimpleTooltip";

export interface LabelProps
  extends ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  label?: ReactNode;
  copyValue?: string;
  required?: boolean;
  helpTooltip?: string;
}

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex h-8 items-center py-1"
);

const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  (
    { className, label, required, copyValue, helpTooltip, children, ...props },
    ref
  ) => {
    const clipboard = useClipboard();
    return label ? (
      <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
      >
        {label}
        {required && <span className="text-red-600">*</span>}
        {copyValue && copyValue.length > 0 && (
          <Button
            size="icon"
            variant="ghost"
            className="ml-1 h-5 w-5"
            onClick={() => {
              clipboard.copy(copyValue);
              toast({
                title: "Skopiowano do schowka",
                description: copyValue,
              });
            }}
            tabIndex={-1}
          >
            <IconCopy size={16} />
          </Button>
        )}
        {helpTooltip && helpTooltip.length > 0 && (
          <SimpleTooltip
            tooltip={helpTooltip}
            className="px-1"
            classNameTooltip="w-80 whitespace-normal dark:whitespace-normal"
            delay="delay-700"
          >
            <IconQuestionMark size={16} />
          </SimpleTooltip>
        )}
        {children}
      </LabelPrimitive.Root>
    ) : null;
  }
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
