import { useIsMobile } from "@/hooks/useIsMobile";
import { UseListStateHandlers, useResizeObserver } from "@mantine/hooks";
import { Portal } from "@radix-ui/react-portal";
import {
  Children,
  Dispatch,
  MouseEvent,
  ReactElement,
  SetStateAction,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { MobileTab } from "./MobileTab";
import { TabProps } from "./Tab";
import {
  MultiTabsContextProvider,
  useMultiTabsContext,
} from "./multiTabsContext";

interface MultiTabsProps {
  children: ReactElement<TabProps> | ReactElement<TabProps>[];
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
  pinned?: number[];
  pinnedHandler?: UseListStateHandlers<number>;
}

function MultiTabs(props: MultiTabsProps) {
  const { children, pinned, pinnedHandler, ...multiTabsState } = props;
  const portalContainerRef = useRef<HTMLElement | null>(null);
  const portalMobileContainerRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [outerRef, outerRect] = useResizeObserver();

  const { isMobile } = useIsMobile();
  useEffect(() => {
    portalContainerRef.current = document.querySelector("#HeaderTabs");
    portalMobileContainerRef.current = document.querySelector("#MobileMenu");
  }, []);

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
        container={
          isMobile
            ? portalMobileContainerRef.current
            : portalContainerRef.current
        }
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
  children: ReactElement<TabProps> | ReactElement<TabProps>[];
  parentWidth: number;
}) {
  const { children, parentWidth } = props;
  const { tabsMaxWidth, togglePin, setActive, pinned } = useMultiTabsContext();
  const [small, setSmall] = useState(false);
  const childrenMaxWidth = tabsMaxWidth.reduce((p, n) => p + n, 0);
  const { isMobile } = useIsMobile();

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
        return cloneElement(
          (isMobile ? <MobileTab /> : child) as typeof child,
          {
            index:
              typeof child.props.index === "number" ? child.props.index : index,
            onContextMenu: (e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              togglePin(index);
            },
            onClick:
              typeof child.props.onClick === "function"
                ? child.props.onClick
                : () => {
                    !isPinned && setActive(index);
                  },
            onMouseDown:
              typeof child.props.onMouseDown === "function"
                ? child.props.onMouseDown
                : (e: MouseEvent<HTMLButtonElement>) => {
                    if (e.button === 1) {
                      console.log("middle click tab: ", index);
                      // TODO: detach window if middle clicked
                    }
                  },
            small,
            ...child.props,
          },
        );
      })}
    </>
  );
}

export default MultiTabs;
