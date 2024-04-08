import { type UseListStateHandlers, useListState } from "@mantine/hooks";
import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface MultiTabsContextType {
  active: number | undefined;
  setActive: Dispatch<SetStateAction<number | undefined>>;
  pinned: number[];
  togglePin: (index: number) => void;
  setPinned: Dispatch<SetStateAction<number[]>>;
  tabsMaxWidth: number[];
  getTabMaxWidth: (index: number) => number | undefined;
  setTabMaxWidth: (index: number, item: number) => void;
}

export const MultiTabsContext = createContext<MultiTabsContextType | null>(
  null,
);

interface MultiTabsContextProviderProps {
  children: ReactNode;
  active: number | undefined;
  pinned: number[];
  setActive: Dispatch<SetStateAction<number | undefined>>;
  pinnedHandler: UseListStateHandlers<number>;
}

export const MultiTabsContextProvider = (
  props: MultiTabsContextProviderProps,
) => {
  const { children, active, pinned, setActive, pinnedHandler } = props;
  const [tabsMaxWidth, tabsMaxWidthHandlers] = useListState<number>();

  return (
    <MultiTabsContext.Provider
      value={{
        active,
        setActive,
        pinned,
        togglePin: (index: number) => {
          const indexOfPinned = pinned.indexOf(index);
          if (indexOfPinned === -1) {
            pinnedHandler.append(index);
          } else {
            pinnedHandler.remove(indexOfPinned);
          }
        },
        setPinned: pinnedHandler.setState,
        tabsMaxWidth,
        getTabMaxWidth: (index: number) => tabsMaxWidth[index],
        setTabMaxWidth: tabsMaxWidthHandlers.setItem,
      }}
    >
      {children}
    </MultiTabsContext.Provider>
  );
};

export function useMultiTabsContext(): MultiTabsContextType {
  const state = useContext(MultiTabsContext);
  if (!state) {
    throw new Error("ERROR: Cannot use MultiTabsContext outside of MultiTabs");
  }
  return state;
}
