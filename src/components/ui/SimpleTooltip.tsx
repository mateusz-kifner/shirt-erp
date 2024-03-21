import type { ReactNode } from "react";

interface SimpleTooltipProps {
  tooltip: ReactNode;
  className?: string;
  classNameTooltip?: string;
  delay?:
    | "delay-0"
    | "delay-75"
    | "delay-100"
    | "delay-150"
    | "delay-200"
    | "delay-300"
    | "delay-500"
    | "delay-700"
    | "delay-1000"
    | "delay-1500"
    | "delay-2000"
    | "delay-2500"
    | "delay-3000";
  children?: ReactNode;
  position?: "top" | "left" | "bottom" | "right";
  align?: "start" | "center" | "end";
  disabled?: boolean;
}

function SimpleTooltip(props: SimpleTooltipProps) {
  const {
    children,
    tooltip,
    className,
    classNameTooltip,
    delay = "delay-1500",
    position = "top",
    align = "center",
    disabled = false,
  } = props;

  if (disabled) return children;

  return (
    <div className={`tooltip${className ?? ""}tooltip-${delay}`}>
      {children}
      <div
        className={`tooltip-text tooltip-text- bg-stone-300 font-normal text-base text-stone-800 normal-case after:border-transparent after:border-t-stone-200 dark:after:border-t-stone-800 dark:bg-stone-800 dark:text-stone-200${position}-${align}${
          classNameTooltip ?? ""
        }`}
      >
        {tooltip}
      </div>
    </div>
  );
}

export default SimpleTooltip;
