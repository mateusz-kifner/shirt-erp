import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";
import { forwardRef, ReactNode } from "react";

const buttonVariants = cva(
  "inline-flex gap-2 items-center justify-center rounded text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-stone-950 dark:focus-visible:ring-stone-800",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-stone-50 hover:bg-blue-700",
        destructive:
          "bg-red-500 rounded text-stone-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-900/90",
        outline:
          "border border-gray-400 bg-white hover:bg-stone-100 hover:text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:hover:bg-stone-700 dark:hover:text-stone-50",
        secondary:
          "bg-stone-100 text-stone-900 hover:bg-stone-100/80 dark:bg-stone-800 dark:text-stone-50 dark:hover:bg-stone-800/80",
        ghost:
          "hover:bg-stone-900 hover:bg-opacity-20  hover:text-stone-900 dark:hover:bg-stone-200 dark:hover:bg-opacity-15 dark:hover:text-stone-50",
        link: "text-stone-900 underline-offset-4 hover:underline dark:text-stone-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9  px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    className,
    variant,
    size,
    asChild = false,
    leftSection,
    rightSection,
    children,
    ...moreProps
  } = props;
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...moreProps}
    >
      {!!leftSection && leftSection}
      {children}
      {!!rightSection && rightSection}
    </Comp>
  );
});
Button.displayName = "Button";

export { buttonVariants, Button as default };
