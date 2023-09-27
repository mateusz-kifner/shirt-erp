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
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
} from "react";
import { useMultiTabsContext } from "./multiTabsContext";

export interface TabProps extends ComponentPropsWithoutRef<"button"> {
  children?: ReactNode;
  rightSection?:
    | ReactNode
    | ((isActive: boolean, isPinned: boolean, color?: string) => ReactNode);
  leftSection?:
    | ReactNode
    | ((isActive: boolean, isPinned: boolean, color?: string) => ReactNode);

  index?: number;
  small?: boolean;
  onMiddleClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (props: TabProps, ref) => {
    const {
      children,
      index,
      leftSection,
      rightSection,
      className,
      small = false,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onMiddleClick,

      ...moreProps
    } = props;
    // throw if used standalone
    if (index === undefined)
      throw new Error("MultiTabs Error: Tab was not provided valid index");

    const color =
      index !== undefined
        ? simpleColors[index % simpleColors.length]
        : undefined;
    const { setTabMaxWidth, getTabMaxWidth, active, pinned } =
      useMultiTabsContext();

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
            typeof (rightSection as { props: Record<string, unknown> })?.props
              ?.color !== undefined
              ? (rightSection as { props: { color: string } }).props.color
              : isActive || isPinned
              ? color
              : undefined,
          size:
            typeof (rightSection as { props: Record<string, unknown> }).props
              .size === "number"
              ? (rightSection as { props: { size: number } }).props.size
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

    useEffect(() => {
      if (rect.width > 1) {
        (getTabMaxWidth(index) ?? 0) < rect.width &&
          setTabMaxWidth(index, rect.width);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rect.width]);

    return (
      <Tooltip>
        <TooltipTrigger
          className={cn(
            `inline-flex
            h-10
            select-none 
            items-center
            justify-center 
            whitespace-nowrap
            border-r
            border-t
            border-solid 
            border-stone-700
            stroke-gray-200 
            px-4 
            py-0 
            font-semibold 
            text-gray-200
            no-underline
            outline-offset-4 
            transition-all
            first:rounded-tl 
            first:border-l
            last:rounded-tr
            only:rounded-tr
            only:border-r 
            hover:bg-transparent 
            focus-visible:outline-sky-600 
            disabled:pointer-events-none	
            disabled:bg-stone-700`,
            isActive || isPinned
              ? "border-b-2 bg-transparent"
              : "border-b bg-stone-800",
            small ? "gap-1" : "gap-3",
            className,
          )}
          ref={mergedRef}
          style={{
            borderBottomColor: isActive || isPinned ? color : undefined,
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

Tab.displayName = "Tab";
