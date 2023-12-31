import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/utils/cn";
import { VariantProps, cva } from "class-variance-authority";

const switchVariants = cva(
  "focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-input peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-1  disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        color:
          "data-[state=checked]:dark:bg-green-500 data-[state=checked]:bg-green-800 data-[state=unchecked]:dark:bg-red-500 data-[state=unchecked]:bg-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> &
    VariantProps<typeof switchVariants>
>(({ className, variant, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchVariants({ variant }), className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
