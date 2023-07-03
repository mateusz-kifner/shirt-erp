import { Children, useId, type ReactNode } from "react";

import { useElementSize } from "@mantine/hooks";
import { type Icon as TablerIcon } from "@tabler/icons-react";
import { useRouter } from "next/router";

import ErrorBoundary from "@/components/ErrorBoundary";
import MultiTabs from "@/components/MultiTabs";
import { useUserContext } from "@/context/userContext";
import useRQCache from "@/hooks/useRQCache";
import useTranslation from "@/hooks/useTranslation";
import { getQueryAsIntOrNull } from "@/utils/query";

// import MultiTabs from "./MultiTabs"

interface WorkspaceProps {
  cacheKey: string;
  childrenWrapperProps?: any[];
  childrenLabels?: string[];
  childrenIcons?: TablerIcon[];
  children?: ReactNode;
  defaultActive?: number;
  defaultPinned?: number[];
  leftMenuSection?: ReactNode;
  rightMenuSection?: ReactNode;
}

const Workspace = ({
  cacheKey,
  children,
  childrenLabels = [],
  childrenIcons = [],
  childrenWrapperProps = [null],
  defaultActive = 1,
  defaultPinned = [0],
  leftMenuSection,
  rightMenuSection,
}: WorkspaceProps) => {
  // const { isSmall, hasTouch } = useAuthContext()
  // const isMobile = hasTouch || isSmall
  // const [menuPosition, setMenuPosition] = useState<[number, number]>([0, 0])
  // const [menuOpened, setMenuOpen] = useState<boolean>(false)
  // const [pinned, setPinned] = useState<number[]>([]);
  // const [active, setActive] = useState<number | undefined>();
  const uuid = useId();
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  const t = useTranslation();
  const { navigationCollapsed, toggleNavigationCollapsed, debug } =
    useUserContext();
  const { ref, width } = useElementSize();

  const [tabStateArray, setTabStateArray] = useRQCache<{
    [key: string]: { active?: number; pinned: number[] };
  }>("pinned_" + cacheKey, {});

  const tabState = tabStateArray[cacheKey] ?? {
    active: defaultActive,
    pinned: defaultPinned,
  };

  const setTabState = (pinned: number[], active?: number) => {
    setTabStateArray({ ...tabStateArray, [cacheKey]: { active, pinned } });
  };

  const togglePin = (pin: number) => {
    if (tabState.pinned.indexOf(pin) !== -1) {
      setTabState(
        tabState.pinned.filter((val) => val !== pin),
        tabState.active
      );
    } else {
      setTabState([...tabState.pinned, pin], tabState.active);
    }
  };

  const setActive = (active?: number) => {
    setTabState(tabState.pinned, active);
  };
  // setPinned((pinnedArray) => {
  //   if (pinnedArray.includes(pinned)) {
  //     return pinnedArray.filter((val) => val !== pinned);
  //   } else {
  //     return [...pinnedArray, pinned];
  //   }
  // });

  const child_array = Children.toArray(children);

  const activeTabs = [...tabState.pinned];
  if (tabState.active !== undefined && !activeTabs.includes(tabState.active))
    activeTabs.push(tabState.active);

  // useEffect(() => {
  //   if (!childrenLabels) return
  //   let new_arr = [...pinned]
  //   if (active && !pinned.includes(active)) new_arr.push(active)
  //   let index_arr = new_arr.map((val) => childrenLabels?.indexOf(val))
  //   setQuery(router, {
  //     show_views: index_arr.map((val) => val.toString()),
  //   })
  // }, [pinned, active])

  // const openMenu = (e: MouseEvent<any, any>) => {
  //   setMenuPosition(isMobile ? [width / 2, 60] : [e.pageX, e.pageY])
  //   setMenuOpen(true)
  // }

  return (
    <div
      className="flex flex-grow flex-nowrap items-start gap-4 overflow-hidden p-1 sm:p-4"
      ref={ref}
    >
      <MultiTabs
        active={tabState.active}
        onActive={setActive}
        pinned={tabState.pinned}
        onPin={togglePin}
        childrenLabels={childrenLabels}
        childrenIcons={childrenIcons}
        availableSpace={width}
        rightSection={rightMenuSection}
        leftSection={leftMenuSection}
      />
      {children &&
        activeTabs.map((childIndex, index) => (
          <div
            key={uuid + index}
            className="relative flex w-[420px] min-w-[420px] flex-col rounded bg-white p-4 shadow-lg dark:bg-stone-800"
            {...(childrenWrapperProps &&
            childrenWrapperProps[childIndex] !== undefined
              ? childrenWrapperProps[childIndex]
              : { style: { flexGrow: 1 } })}
          >
            <ErrorBoundary
              fallback={
                <h1>
                  Tab number {childIndex} named {'"'}
                  {childrenLabels[childIndex] ?? "[unknown]"}
                  {'"'} encountered irreparable error and crashed, please reload
                  page.
                </h1>
              }
            >
              {child_array[childIndex]}
            </ErrorBoundary>
          </div>
        ))}
    </div>
  );
};

export default Workspace;
