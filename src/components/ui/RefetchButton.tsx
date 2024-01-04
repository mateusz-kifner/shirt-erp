import { IconRefresh } from "@tabler/icons-react";
import Button, { type ButtonProps } from "./Button";
import { cn } from "@/utils/cn";
import { useTimeout } from "@mantine/hooks";
import { useState } from "react";

function RefetchButton(props: ButtonProps) {
  const { className, onClick, ...moreProps } = props;
  const [isRotating, setIsRotating] = useState(false);
  const { start } = useTimeout(() => setIsRotating(false), 1500);

  return (
    <Button
      {...moreProps}
      size="icon"
      variant="ghost"
      className={cn(
        "rounded-full border-stone-800 bg-stone-800  direction-reverse hover:bg-stone-700  hover:text-stone-50",
        isRotating && "animate-spin",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        setIsRotating(true);
        start();
      }}
    >
      <IconRefresh />
    </Button>
  );
}

export default RefetchButton;
