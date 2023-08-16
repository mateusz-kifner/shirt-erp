import {
  Children,
  ReactElement,
  cloneElement,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";

import { useElementSize } from "@mantine/hooks";
import { useRouter } from "next/router";

import { useUserContext } from "@/context/userContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import useTranslation from "@/hooks/useTranslation";
import TablerIconType from "@/schema/TablerIconType";
import { cn } from "@/utils/cn";
import { getQueryAsIntOrNull } from "@/utils/query";
import * as Portal from "@radix-ui/react-portal";
import { IconAlertCircle } from "@tabler/icons-react";
import { ErrorBoundary } from "react-error-boundary";
import MultiTabs from "./MultiTabs/MultiTabs";
import { Tab } from "./MultiTabs/Tab";
import useMultiTabsState from "./MultiTabs/useMultiTabsState";

// import MultiTabs from "./MultiTabs"

interface WorkspaceProps {
  cacheKey: string;
  childrenWrapperProps?: any[];
  childrenLabels?: string[];
  childrenIcons?: TablerIconType[];
  children?: ReactNode;
  defaultActive?: number;
  defaultPinned?: number[];
  leftMenuSection?: ReactElement | null;
  rightMenuSection?: ReactElement | null;
  disablePin?: boolean;
}

const Workspace = ({
  cacheKey,
  children,
  childrenLabels = [],
  childrenIcons = [],
  childrenWrapperProps = [],
  defaultActive = 1,
  defaultPinned = [0],
  leftMenuSection,
  rightMenuSection,
  disablePin,
}: WorkspaceProps) => {
  // const [menuPosition, setMenuPosition] = useState<[number, number]>([0, 0])
  // const [menuOpened, setMenuOpen] = useState<boolean>(false)
  // const [pinned, setPinned] = useState<number[]>([]);
  // const [active, setActive] = useState<number | undefined>();
  const uuid = useId();
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");
  const multiTabsState = useMultiTabsState(
    defaultActive,
    defaultPinned,
    cacheKey,
  );

  const t = useTranslation();
  const { navigationCollapsed, toggleNavigationCollapsed, debug } =
    useUserContext();
  const { ref, width } = useElementSize();
  const childrenCount = Children.count(children);
  const childrenWrapperProps2 =
    childrenCount < 2 && childrenWrapperProps.length === 0 ? [] : [null];
  const { isMobile } = useIsMobile();

  const portalContainerRef = useRef<HTMLDivElement | null>(null);

  const child_array = Children.toArray(children);

  const activeTabs = [...multiTabsState.pinned];
  if (
    multiTabsState.active !== undefined &&
    !activeTabs.includes(multiTabsState.active)
  )
    activeTabs.push(multiTabsState.active);

  useEffect(() => {
    if (isMobile) {
      multiTabsState.pinnedHandler.setState([0]);
      id !== null && multiTabsState.active === 0 && multiTabsState.setActive(1);
    }
  }, [isMobile, multiTabsState.active, multiTabsState.pinned.length, id]);

  useEffect(() => {
    if (multiTabsState.active >= childrenCount) {
      multiTabsState.setActive(0);
    }
    if (
      multiTabsState.pinned.find((val) => val === multiTabsState.active) !==
        undefined &&
      multiTabsState.active + 1 < childrenCount
    ) {
      multiTabsState.setActive(multiTabsState.active + 1);
    }
    multiTabsState.pinnedHandler.filter((val) => val < childrenCount);
  }, [multiTabsState.active, multiTabsState.pinned.length]);

  useEffect(() => {
    portalContainerRef.current = document.querySelector("#MobileMenuPinned");
  }, []);

  const tabsChildren: ReactElement[] = childrenLabels.map((label, index) => {
    const Icon =
      childrenIcons?.[index] ??
      childrenIcons?.[childrenIcons.length - 1] ??
      IconAlertCircle;
    return (
      <Tab
        key={`${uuid}${index}`}
        leftSection={<Icon />}
        onMiddleClick={() =>
          window.open(
            `${router.asPath}?no-ui=1&select-tab=${index}`,
            "_blank",
            "resizable,scrollbars=yes,toolbar=no,status=no,location=no,menubar=no",
          )
        }
      >
        {label}
      </Tab>
    );
  });
  rightMenuSection &&
    tabsChildren.push(cloneElement(rightMenuSection, { key: `${uuid}_right` }));

  return (
    <div
      className="flex flex-grow flex-nowrap items-start gap-4 overflow-hidden p-1 sm:p-4"
      ref={ref}
    >
      <MultiTabs
        {...multiTabsState}
        key={childrenLabels.reduce((prev, next) => prev + next, "")}
      >
        {tabsChildren}
      </MultiTabs>
      {isMobile && (
        <Portal.Root container={portalContainerRef.current}>
          {children &&
            multiTabsState.pinned.map((childIndex, index) => (
              <div
                key={uuid + index}
                className="flex  flex-grow
               flex-col rounded bg-white shadow-lg dark:bg-stone-800"
                {...(childrenWrapperProps2 &&
                childrenWrapperProps2[childIndex] !== undefined
                  ? childrenWrapperProps2[childIndex]
                  : { style: { flexGrow: 1 } })}
              >
                <ErrorBoundary
                  fallback={
                    <h1>
                      Tab number {childIndex} named {'"'}
                      {childrenLabels[childIndex] ?? "[unknown]"}
                      {'"'} encountered irreparable error and crashed, please
                      reload page.
                    </h1>
                  }
                >
                  {child_array[childIndex]}
                </ErrorBoundary>
              </div>
            ))}
        </Portal.Root>
      )}
      {children &&
        (isMobile ? [multiTabsState.active] : activeTabs).map(
          (childIndex, index) => (
            <div
              key={uuid + index}
              className={cn(
                "flex  flex-col rounded bg-white shadow-lg dark:bg-stone-800",
                isMobile ? "flex-grow" : "w-[420px] min-w-[420px]",
              )}
              {...(childrenWrapperProps2 &&
              childrenWrapperProps2[childIndex] !== undefined
                ? childrenWrapperProps2[childIndex]
                : { style: { flexGrow: 1 } })}
            >
              <ErrorBoundary
                fallback={
                  <h1>
                    Tab number {childIndex} named {'"'}
                    {childrenLabels[childIndex] ?? "[unknown]"}
                    {'"'} encountered irreparable error and crashed, please
                    reload page.
                  </h1>
                }
              >
                {child_array[childIndex]}
              </ErrorBoundary>
            </div>
          ),
        )}
    </div>
  );
};

export default Workspace;
