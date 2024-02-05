import {
  createContext,
  useContext,
  type ReactNode,
  type SetStateAction,
  type Dispatch,
} from "react";

import { useLocalStorage } from "@mantine/hooks";

// TODO: make flags simpler
// IMP: Make flags server side

interface FlagEditableAddress {
  editableAddressMode?: "popup" | "extend" | "always_visible";
  setEditableAddressMode: Dispatch<
    SetStateAction<"popup" | "extend" | "always_visible">
  >;
  mobileOverride?: "auto" | "mobile" | "desktop";
  setMobileOverride: Dispatch<SetStateAction<"auto" | "mobile" | "desktop">>;
  calendarDefaultClick: "order" | "task";
  setCalendarDefaultClick: Dispatch<SetStateAction<"order" | "task">>;
  calendarDefaultViewMode: "month" | "week";
  setCalendarDefaultViewMode: Dispatch<SetStateAction<"month" | "week">>;
  calendarDefaultDataSource: "all" | "user";
  setCalendarDefaultDataSource: Dispatch<SetStateAction<"all" | "user">>;
}

interface FlagContextType extends FlagEditableAddress {}

export const FlagContext = createContext<FlagContextType | null>(null);

export const FlagContextProvider = ({ children }: { children: ReactNode }) => {
  const [editableAddressMode, setEditableAddressMode] = useLocalStorage<
    "popup" | "extend" | "always_visible"
  >({
    key: "flag-editable-address-mode",
    defaultValue: "always_visible",
  });

  const [mobileOverride, setMobileOverride] = useLocalStorage<
    "auto" | "mobile" | "desktop"
  >({
    key: "flag-mobile-override",
    defaultValue: "auto",
  });

  const [calendarDefaultClick, setCalendarDefaultClick] = useLocalStorage<
    "order" | "task"
  >({
    key: "flag-calendar-default-click",
    defaultValue: "order",
  });

  const [calendarDefaultViewMode, setCalendarDefaultViewMode] = useLocalStorage<
    "month" | "week"
  >({
    key: "flag-calendar-default-view-mode",
    defaultValue: "month",
  });

  const [calendarDefaultDataSource, setCalendarDefaultDataSource] =
    useLocalStorage<"all" | "user">({
      key: "flag-calendar-default-data-source",
      defaultValue: "all",
    });

  return (
    <FlagContext.Provider
      value={{
        editableAddressMode,
        setEditableAddressMode,
        mobileOverride,
        setMobileOverride,
        calendarDefaultClick,
        setCalendarDefaultClick,
        calendarDefaultViewMode,
        setCalendarDefaultViewMode,
        calendarDefaultDataSource,
        setCalendarDefaultDataSource,
      }}
    >
      {children}
    </FlagContext.Provider>
  );
};

export function useFlagContext(): FlagContextType {
  const state = useContext(FlagContext);
  if (!state) {
    throw new Error(
      `ERROR: FlagContext reached invalid state, null 'Flag' in context`,
    );
  }
  return state;
}
