import {
  Children,
  type ReactElement,
  useEffect,
  useId,
  useRef,
  type ReactNode,
  useLayoutEffect,
  useState,
} from "react";

import { useRouter } from "next/router";

import { useIsMobile } from "@/hooks/useIsMobile";
import type TablerIconType from "@/types/TablerIconType";
import { cn } from "@/utils/cn";
import * as Portal from "@radix-ui/react-portal";
import { IconAlertCircle } from "@tabler/icons-react";
import { ErrorBoundary } from "react-error-boundary";
import MultiTabs from "./MultiTabs/MultiTabs";
import { Tab } from "./MultiTabs/Tab";
import useMultiTabsState from "./MultiTabs/useMultiTabsState";
import { Card } from "@shirterp/ui-web/Card";

// import MultiTabs from "./MultiTabs"
interface WorkspaceItemMetadata {
  label: string;
  icon?: TablerIconType;

  props?: Record<string, any>;
}

interface WorkspaceProps {
  childrenMetadata?: WorkspaceItemMetadata[];
  children?: ReactNode;
  onChange?: () => void;
}

const Workspace = ({
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
  const initialPinned: number[] = [];
  const initialActive = childrenCount > 0 ? 0 : undefined;

  const multiTabsState = useMultiTabsState(
    initialActive,
    initialPinned,
    // cacheKey,
  );

  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    setPortalContainer(
      document.querySelector("#MobileMenuPinned") as HTMLElement | null,
    );
  }, [
    typeof document !== "undefined" &&
      (document.querySelector("#MobileMenuPinned") as HTMLElement | null),
  ]);

  // join metadata
  const joinedMetadata: WorkspaceItemMetadata[] = childrenMetadata ?? [];

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
        <Portal.Root container={portalContainer}>
          {children &&
            multiTabsState.pinned.map((childIndex, index) => (
              <div
                key={uuid + index}
                className="flex flex-grow flex-col rounded bg-white shadow-lg dark:bg-stone-800"
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
      {children &&
        Children.map(children, (child, childIndex) =>
          allActive.includes(childIndex) ? (
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
