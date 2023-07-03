import {
  forwardRef,
  useEffect,
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type SyntheticEvent,
} from "react";

import { useMergedRef, useResizeObserver } from "@mantine/hooks";
import { IconPinned } from "@tabler/icons-react";
import { omit } from "lodash";

import Portal from "@/components/Portal";
import Tooltip from "@/components/ui/Tooltip";
import { useUserContext } from "@/context/userContext";
import type TablerIconType from "@/types/TablerIconType";
import { simpleColors } from "@/utils/getRandomColor";

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
  setBigSize?: (size: number) => void;
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
      setBigSize,
      isActive = false,
      onClick,
      onContextMenu,
      index,
      className,
    } = props;
    const [resizeRef, rect] = useResizeObserver();
    const groupRef = useMergedRef(resizeRef, ref);

    useEffect(() => {
      rect.width !== 0 && !small && setBigSize?.(rect.width + 46);
      //eslint-disable-next-line
    }, [rect.width]);

    const hasIcon = !!Icon;
    const hasRightSection = !!rightSection;
    const color =
      index !== undefined
        ? simpleColors[index % simpleColors.length]
        : undefined;

    return (
      <Tooltip tooltip={!!small && children} withinPortal position="bottom">
        <button
          className={`
            inline-flex
            h-10
            select-none 
            items-center
            justify-center 
            gap-3 
            border-x 
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
            first:border-r-0
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
            disabled:bg-stone-700
            ${className ?? ""}
            ${isActive ? "bg-transparent" : "bg-stone-800"}
            ${isActive ? "border-b-2" : "border-b"}
            `}
          ref={groupRef}
          onClick={onClick}
          onContextMenu={onContextMenu}
          style={{
            borderBottomColor: isActive ? color : undefined,
          }}
          {...omit(props, [
            "isActive",
            "setBigSize",
            "small",
            "rightSection",
            "Icon",
            "children",
          ])}
        >
          {hasIcon &&
            (isActive && color ? (
              <Icon size={16} color={color} />
            ) : (
              <Icon size={16} />
            ))}
          {!small && children}
          {hasRightSection && rightSection}
        </button>
      </Tooltip>
    );
  }
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
    availableSpace,
  } = props;
  const { navigationCollapsed, setNavigationCollapsed } = useUserContext();
  const [tabsSizes, setTabsSizes] = useState<number[]>([]);
  const uuid = useId();
  const [ref, rect] = useResizeObserver();
  const maxSize = tabsSizes.reduce((prev, next) => prev + next, 0);
  const small = maxSize + 108 > rect.width;
  const childrenLabelsKey = childrenLabels.reduce(
    (prev, next) => prev + next,
    ""
  );

  // const t = useTranslation();
  useEffect(() => {
    setTabsSizes([]);
  }, [childrenLabelsKey]);

  // if (isSmall || hasTouch) {
  //   return (
  //     <Portal target="#SpecialMenu">
  //       <Stack>
  //         {!!leftSection && leftSection}
  //         {childrenLabels.map((label, index) => {
  //           const Icon =
  //             childrenIcons?.[index] ??
  //             childrenIcons?.[childrenIcons.length - 1] ??
  //             IconAlertCircle;

  //           const color =
  //             index !== undefined
  //               ? simpleColors[index % simpleColors.length]
  //               : undefined;
  //           return (
  //             <Button
  //               key={uuid + "_" + index}
  //               px="md"
  //               leftIcon={<Icon size={32} />}
  //               onClick={() => {
  //                 onTabChange(index);
  //                 setNavigationCollapsed(false);
  //               }}
  //               disabled={index === active}
  //               variant="outline"
  //               style={{
  //                 borderColor: color,
  //                 color: color,
  //               }}
  //               size="xl"
  //             >
  //               <Text size="md">{label}</Text>
  //             </Button>
  //           );
  //         })}
  //         {!!rightSection && rightSection}
  //       </Stack>
  //     </Portal>
  //   );
  // }

  return (
    <Portal target="#HeaderTabs">
      <div className="flex h-14 items-end px-4" ref={ref}>
        <div>
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
                setBigSize={
                  (size) => {
                    /**/
                  }
                  // setTabsSizes((val) => {
                  //   let new_arr = [...val];
                  //   new_arr[index] = size;
                  //   return new_arr;
                  // })
                }
                rightSection={
                  !!rightSection ? (
                    rightSection
                  ) : isPinned ? (
                    <IconPinned size={16} />
                  ) : undefined
                }
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
        </div>
      </div>
    </Portal>
  );
};

export default MultiTabs;
