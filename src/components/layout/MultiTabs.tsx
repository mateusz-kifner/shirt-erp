import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type SyntheticEvent,
} from "react";

import {
  useDebouncedValue,
  useMediaQuery,
  useResizeObserver,
} from "@mantine/hooks";
import { IconAlertCircle, IconPinned } from "@tabler/icons-react";

import { useUserContext } from "@/context/userContext";
import type TablerIconType from "@/schema/TablerIconType";
import { cn } from "@/utils/cn";
import { simpleColors } from "@/utils/getRandomColor";
import { Portal } from "@radix-ui/react-portal";
import { usePrev } from "@react-spring/shared";
import Button from "../ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";

export interface TabProps extends ComponentPropsWithoutRef<"button"> {
  /** Value that is used to connect Tab with associated panel */
  value: number;

  /** Tab label */
  children?: React.ReactNode;

  /** Section of content displayed after label */
  rightSection?: React.ReactNode;

  /** Section of content displayed before label */
  Icon?: TablerIconType;

  small?: boolean;
  isActive?: boolean;
  index?: number;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (props: TabProps, ref) => {
    const {
      children,
      Icon,
      rightSection,
      small = false,
      isActive = false,
      onClick,
      onContextMenu,
      index,
      className,
      ...moreProps
    } = props;
    const hasIcon = !!Icon;
    const hasRightSection = !!rightSection;
    const color =
      index !== undefined
        ? simpleColors[index % simpleColors.length]
        : undefined;
    return (
      <Tooltip>
        <TooltipTrigger
          className={cn(
            `inline-flex
            h-10
            select-none 
            items-center
            justify-center 
            gap-3 
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
            active:hover:scale-95 
            active:hover:animate-none 
            active:focus:scale-95 
            active:focus:animate-none 
            disabled:pointer-events-none	
            disabled:bg-stone-700`,
            isActive ? "border-b-2 bg-transparent" : "border-b bg-stone-800",
            className,
          )}
          ref={ref}
          onClick={onClick}
          onContextMenu={onContextMenu}
          style={{
            borderBottomColor: isActive ? color : undefined,
          }}
          {...moreProps}
        >
          {hasIcon &&
            (isActive && color ? (
              <Icon size={16} color={color} />
            ) : (
              <Icon size={16} />
            ))}
          {!small && children}
          {hasRightSection && rightSection}
        </TooltipTrigger>
        {!!small && <TooltipContent side="bottom">{children}</TooltipContent>}
      </Tooltip>
      // <Tooltip tooltip={!!small && children} withinPortal position="bottom">

      // </Tooltip>
    );
  },
);

Tab.displayName = "Tab";

interface MultiTabsProps {
  active?: number;
  onActive: (active?: number) => void;

  pinned: number[];
  onPin: (pinned: number) => void;

  childrenLabels: string[];
  childrenIcons: TablerIconType[];

  leftSection?: ReactNode;
  rightSection?: ReactNode;

  availableSpace: number;
}

const MultiTabs = (props: MultiTabsProps) => {
  const {
    active,
    onActive,
    pinned,
    onPin,
    childrenLabels,
    childrenIcons,
    rightSection,
    leftSection,
  } = props;
  const portalContainerRef = useRef<HTMLElement | null>(null);
  const portalContainerInnerRef = useRef<HTMLDivElement | null>(null);
  const portalMobileContainerRef = useRef<HTMLElement | null>(null);
  const [small, setSmall] = useState(false);
  const { navigationCollapsed, setNavigationCollapsed } = useUserContext();
  const uuid = useId();
  const childrenLabelsKey = childrenLabels.reduce(
    (prev, next) => prev + next,
    "",
  );
  const prevChildrenLabelsKey = usePrev(childrenLabelsKey);
  const [innerRef, innerRect] = useResizeObserver();
  const [outerRef, outerRect] = useResizeObserver();
  const [outerWidth] = useDebouncedValue(outerRect.width, 200, {
    leading: true,
  });

  const hasTouch = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)",
  );

  const isSmall = useMediaQuery(`(max-width: 780px)`, true);

  useEffect(() => {
    setSmall(innerRect.width > outerWidth);
  }, [outerWidth]);

  // useEffect(() => {
  //   setSmall(false);
  // }, [childrenLabels.length]);

  // const t = useTranslation();
  // useEffect(() => {
  //   setTabsSizes([]);
  // }, [childrenLabelsKey]);

  useEffect(() => {
    portalContainerRef.current = document.querySelector("#HeaderTabs");
    portalMobileContainerRef.current = document.querySelector("#SpecialMenu");
  }, []);

  if (isSmall || hasTouch) {
    return (
      <Portal container={portalMobileContainerRef.current}>
        <div className="flex flex-col gap-2">
          {!!leftSection && leftSection}
          {childrenLabels.map((label, index) => {
            const Icon =
              childrenIcons?.[index] ??
              childrenIcons?.[childrenIcons.length - 1] ??
              IconAlertCircle;

            const color =
              index !== undefined
                ? simpleColors[index % simpleColors.length]
                : undefined;
            return (
              <Button
                key={uuid + "_" + index}
                leftSection={<Icon size={32} />}
                onClick={() => {
                  onActive(index);
                  setNavigationCollapsed(false);
                }}
                disabled={index === active}
                variant="outline"
                style={{
                  borderColor: color,
                  color: color,
                }}
              >
                {label}
              </Button>
            );
          })}
          {!!rightSection && rightSection}
        </div>
      </Portal>
    );
  }

  return (
    <Portal
      container={portalContainerRef.current}
      className="relative overflow-hidden"
      ref={outerRef}
    >
      <div className="flex h-14 w-fit items-end px-4" ref={innerRef}>
        {childrenLabels.map((label, index) => {
          const isPinned = pinned?.includes(index);

          return (
            <Tab
              index={index}
              key={`${uuid}_${index}_${childrenLabelsKey}`}
              value={index}
              Icon={
                childrenIcons?.[index] ??
                childrenIcons?.[childrenIcons.length - 1]
              }
              small={small}
              rightSection={isPinned ? <IconPinned size={16} /> : undefined}
              isActive={active === index || isPinned}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              onClick={() => !isPinned && onActive(index)}
              onContextMenu={(e: SyntheticEvent) => {
                e.preventDefault();
                onPin(index);
              }}
            >
              {label}
            </Tab>
          );
        })}
        {!!rightSection && rightSection}
      </div>
    </Portal>
  );
};

export default MultiTabs;
