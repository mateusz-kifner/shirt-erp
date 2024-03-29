import {
  Children,
  type ReactElement,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";

// import { useElementSize } from "@mantine/hooks";
import { useRouter } from "next/router";

import { useIsMobile } from "@/hooks/useIsMobile";
// import useTranslation from "@/hooks/useTranslation";
import type TablerIconType from "@/types/TablerIconType";
import { cn } from "@/utils/cn";
import * as Portal from "@radix-ui/react-portal";
import { IconAlertCircle } from "@tabler/icons-react";
import { ErrorBoundary } from "react-error-boundary";
import MultiTabs from "./MultiTabsOld/MultiTabs";
import { Tab } from "./MultiTabsOld/Tab";
import useMultiTabsState from "./MultiTabsOld/useMultiTabsState";
import { Card } from "../ui/Card";

// import MultiTabs from "./MultiTabs"
interface WorkspaceItemMetadata {
  label: string;
  icon?: TablerIconType;

  props?: Record<string, any>;
}

interface WorkspaceProps {
  cacheKey: string;
  navigation?: ReactNode;
  navigationMetadata?: WorkspaceItemMetadata[];
  childrenMetadata?: WorkspaceItemMetadata[];
  children?: ReactNode;
  onChange?: () => void;
}

const Workspace = ({
  // cacheKey,
  navigation,
  navigationMetadata,
  childrenMetadata,
  children,
  onChange,
}: WorkspaceProps) => {
  // tools
  const uuid = useId();
  const router = useRouter();
  const isMobile = useIsMobile();
  // const t = useTranslation();

  const childArray = Children.toArray(children);
  const childrenCount = Children.count(children);

  // state
  const initialPinned: number[] = [0];
  const initialActive = childrenCount === 0 ? 0 : 1;

  const multiTabsState = useMultiTabsState(
    initialActive,
    initialPinned,
    // cacheKey,
  );

  // refs / callbacks
  // const { ref, width } = useElementSize();
  const portalContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    portalContainerRef.current = document.querySelector("#MobileMenuPinned");
  }, []);

  // join metadata
  const joinedMetadata: WorkspaceItemMetadata[] = (
    navigationMetadata ?? []
  ).concat(childrenMetadata ?? []);

  const tabsChildren: ReactElement[] = joinedMetadata.map(
    (metadata, index, metadataArr) => {
      const Icon =
        metadata.icon ??
        metadataArr[metadataArr.length - 1]?.icon ??
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
          {...metadata.props}
        >
          {metadata.label}
        </Tab>
      );
    },
  );

  const allActive = Array.from(
    new Set([multiTabsState.active, ...multiTabsState.pinned]),
  );
  const navigationChildrenCount = Children.count(navigation);

  return (
    <div
      className="flex flex-grow flex-nowrap items-start gap-4 p-1 sm:p-4"
      // ref={ref}
    >
      <MultiTabs
        {...multiTabsState}
        setActive={(v) => {
          onChange?.();
          multiTabsState.setActive(v);
        }}
        key={
          childrenMetadata
            ? childrenMetadata.reduce((prev, next) => prev + next.label, uuid)
            : `${uuid}_empty`
        }
      >
        {tabsChildren}
      </MultiTabs>
      {isMobile && (
        <Portal.Root container={portalContainerRef.current}>
          {children &&
            multiTabsState.pinned.map((childIndex, index) => (
              <div
                key={uuid + index}
                className="flex flex-grow flex-col rounded bg-white shadow-lg dark:bg-stone-800"
                // {...(childrenWrapperProps2 &&
                // childrenWrapperProps2[childIndex] !== undefined
                //   ? childrenWrapperProps2[childIndex]
                //   : { style: { flexGrow: 1 } })}
              >
                <ErrorBoundary
                  fallback={
                    <h1>
                      Tab number {childIndex} named {'"'}
                      {childrenMetadata?.[childIndex]?.label ?? "[unknown]"}
                      {'"'} encountered irreparable error and crashed, please
                      reload page.
                    </h1>
                  }
                >
                  {childArray[childIndex]}
                </ErrorBoundary>
              </div>
            ))}
        </Portal.Root>
      )}
      {!isMobile &&
        navigation &&
        Children.map(navigation, (child, childIndex) =>
          allActive.includes(childIndex) ? (
            <Card
              key={`${uuid} ${childIndex}`}
              className={cn(
                // "flex  flex-col rounded shadow-lg ",
                isMobile ? "flex-grow" : "w-[420px] min-w-[420px]",
              )}
              {...(navigationMetadata &&
              navigationMetadata[childIndex]?.props !== undefined
                ? navigationMetadata[childIndex]?.props
                : { style: {} })}
            >
              <ErrorBoundary
                fallback={
                  <h1>
                    Tab number {childIndex} named {'"'}
                    {childrenMetadata?.[childIndex]?.label ?? "[unknown]"}
                    {'"'} encountered irreparable error and crashed, please
                    reload page.
                  </h1>
                }
              >
                {child}
              </ErrorBoundary>
            </Card>
          ) : null,
        )}
      {children &&
        Children.map(children, (child, childIndex) =>
          allActive.includes(childIndex + navigationChildrenCount) ? (
            <Card
              key={`${uuid} ${childIndex}`}
              className={cn(
                // "flex  flex-col rounded bg-white shadow-lg dark:bg-stone-800",
                isMobile ? "flex-grow" : "w-[420px] min-w-[420px]",
              )}
              {...(childrenMetadata &&
              childrenMetadata[childIndex]?.props !== undefined
                ? childrenMetadata[childIndex]?.props
                : { style: { flexGrow: 1 } })}
            >
              <ErrorBoundary
                fallback={
                  <h1>
                    Tab number {childIndex} named {'"'}
                    {childrenMetadata?.[childIndex]?.label ?? "[unknown]"}
                    {'"'} encountered irreparable error and crashed, please
                    reload page.
                  </h1>
                }
              >
                {child}
              </ErrorBoundary>
            </Card>
          ) : null,
        )}
    </div>
  );
};

export default Workspace;
