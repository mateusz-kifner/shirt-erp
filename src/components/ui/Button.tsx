import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/utils/cn";

const buttonVariants = cva(`inline-flex
    select-none 
    items-center 
    justify-center
    gap-3 rounded-md 
    font-semibold  
    no-underline 
    outline-offset-4
    transition-all 
    duration-75 
    focus-visible:outline-sky-600 
    disabled:pointer-events-none 
    disabled:bg-gray-700`,
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
  extends ButtonHTMLAttributes<HTMLButtonElement>,
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
