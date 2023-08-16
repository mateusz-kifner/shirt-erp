import { buttonVariants } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/utils/cn";
import { simpleColors } from "@/utils/getRandomColor";
import { useMergedRef, useResizeObserver } from "@mantine/hooks";
import { IconPinned } from "@tabler/icons-react";
import {
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
  cloneElement,
  forwardRef,
  isValidElement,
} from "react";
import { useMultiTabsContext } from "./multiTabsContext";

export interface MobileTabProps extends ComponentPropsWithoutRef<"button"> {
  children?: ReactNode;
  rightSection?:
    | ReactNode
    | ((isActive: boolean, isPinned: boolean, color?: string) => ReactNode);
  leftSection?:
    | ReactNode
    | ((isActive: boolean, isPinned: boolean, color?: string) => ReactNode);

  index?: number;
  small?: boolean;
}

export const MobileTab = forwardRef<HTMLButtonElement, MobileTabProps>(
  (props: MobileTabProps, ref) => {
    const {
      children,
      index,
      leftSection,
      rightSection,
      className,
      small = false,
      ...moreProps
    } = props;
    // throw if used standalone
    if (index === undefined)
      throw new Error("MultiTabs Error: Tab was not provided valid index");

    const color =
      index !== undefined
        ? simpleColors[index % simpleColors.length]
        : undefined;
    const { active, pinned } = useMultiTabsContext();

    const isActive = active === index;
    const isPinned = pinned.indexOf(index) !== -1;

    let left: ReactNode;
    if (isValidElement(leftSection)) {
      // if component pass color
      left = cloneElement(
        leftSection as ReactElement<{
          color: string;
        }>,
        { color: isActive || isPinned ? color : undefined },
      );
    } else if (typeof leftSection === "function") {
      // if function run with params
      left = leftSection(isActive, isPinned, color);
    } else {
      left = leftSection;
    }

    let right: ReactNode;
    if (isValidElement(rightSection)) {
      // if component pass color
      right = cloneElement(
        rightSection as ReactElement<{
          color: string;
          size: number;
        }>,
        {
          color:
            typeof rightSection.props.color !== undefined
              ? rightSection.props.color
              : isActive || isPinned
              ? color
              : undefined,
          size:
            typeof rightSection.props.size === "number"
              ? rightSection.props.size
              : 16,
        },
      );
    } else if (typeof rightSection === "function") {
      // if function run with params
      right = rightSection(isActive, isPinned, color);
    } else if (!rightSection) {
      // if undefined set pin icon
      right = isPinned ? <IconPinned /> : undefined;
    } else {
      right = rightSection;
    }
    const [observerRef, rect] = useResizeObserver();
    const mergedRef = useMergedRef(ref, observerRef);

    return (
      <Tooltip>
        <TooltipTrigger
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "w-full flex-grow text-lg",
            isActive || isPinned
              ? "border-2 bg-transparent"
              : "border bg-stone-800",
            className,
          )}
          ref={mergedRef}
          style={{
            borderColor: isActive || isPinned ? color : undefined,
          }}
          {...moreProps}
        >
          {!!left && left}
          {!small && children}
          {!!right && right}
        </TooltipTrigger>
        {!!small && <TooltipContent side="bottom">{children}</TooltipContent>}
      </Tooltip>
    );
  },
);

MobileTab.displayName = "MobileTab";
