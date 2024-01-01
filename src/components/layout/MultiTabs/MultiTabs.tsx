/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useIsMobile } from "@/hooks/useIsMobile";
import { type UseListStateHandlers, useResizeObserver } from "@mantine/hooks";
import { Portal } from "@radix-ui/react-portal";
import {
  Children,
  type Dispatch,
  type MouseEvent,
  type ReactElement,
  type SetStateAction,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MultiTabsContextProvider,
  useMultiTabsContext,
} from "./multiTabsContext";

interface MultiTabsProps {
  children: ReactElement | ReactElement[];
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
  pinned?: number[];
  pinnedHandler?: UseListStateHandlers<number>;
}

function MultiTabs(props: MultiTabsProps) {
  const { children, pinned, pinnedHandler, ...multiTabsState } = props;
  const innerRef = useRef<HTMLDivElement>(null);
  const [outerRef, outerRect] = useResizeObserver();

  const isMobile = useIsMobile();
  let portalContainer: HTMLElement =
    globalThis?.document?.querySelector("#HeaderTabs")!;
  if (!portalContainer) return null;

  return (
    <MultiTabsContextProvider
      pinned={pinned ?? []}
      pinnedHandler={
        pinnedHandler ?? {
          append: () => {},
          apply: () => {},
          applyWhere: () => {},
          filter: () => {},
          insert: () => {},
          pop: () => {},
          prepend: () => {},
          remove: () => {},
          reorder: () => {},
          setItem: () => {},
          setItemProp: () => {},
          setState: () => {},
          shift: () => {},
        }
      }
      {...multiTabsState}
    >
      <Portal
        container={portalContainer}
        className="relative overflow-hidden"
        ref={outerRef}
      >
        <div
          className={
            isMobile
              ? "flex w-full flex-col gap-2 px-4"
              : "flex h-14 w-fit items-end px-4"
          }
          ref={innerRef}
        >
          <MultiTabsContent parentWidth={outerRect.width}>
            {children}
          </MultiTabsContent>
        </div>
      </Portal>
    </MultiTabsContextProvider>
  );
}

function MultiTabsContent(props: {
  children: ReactElement | ReactElement[];
  parentWidth: number;
}) {
  const { children, parentWidth } = props;
  const { tabsMaxWidth, togglePin, setActive, pinned } = useMultiTabsContext();
  const [small, setSmall] = useState(false);
  const childrenMaxWidth = tabsMaxWidth.reduce((p, n) => p + n, 0);

  useEffect(() => {
    if (parentWidth > 0) {
      if (childrenMaxWidth > 0) {
        setSmall(parentWidth < childrenMaxWidth);
      }
    }
  }, [parentWidth, childrenMaxWidth]);

  return (
    <>
      {Children.map(children, (child, index) => {
        const isPinned = pinned.indexOf(index) !== -1;
        if (!child) return null;
        return cloneElement(child, {
          index:
            typeof (child as { props: Record<string, any> }).props?.index ===
            "number"
              ? (child as { props: { index: number } }).props.index
              : index,
          onContextMenu: (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            togglePin(index);
          },
          onClick:
            typeof (child as { props: Record<string, any> }).props?.onClick ===
            "function"
              ? (child as { props: { onClick: () => void } }).props.onClick
              : () => {
                  !isPinned && setActive(index);
                },
          onMouseDown:
            typeof (child as { props: Record<string, any> }).props
              ?.onMouseDown === "function"
              ? (child as { props: { onMouseDown: () => void } }).props
                  .onMouseDown
              : (e: MouseEvent<HTMLButtonElement>) => {
                  if (e.button === 1) {
                    (
                      child as {
                        props?: { onMiddleClick?: (e: any) => void };
                      }
                    ).props?.onMiddleClick?.(e);
                  }
                },
          small,
          ...child.props,
        });
      })}
    </>
  );
}

export default MultiTabs;
