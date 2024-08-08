import { createContext, useContext, type ReactNode } from "react";

import { useLocalStorage } from "@mantine/hooks";

interface ExperimentalContextType {
  extendedList?: boolean;
  toggleExtendedList: () => void;
}

export const ExperimentalContext =
  createContext<ExperimentalContextType | null>(null);

export const ExperimentalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [extendedList, setExtendedList] = useLocalStorage<boolean>({
    key: "experimental-extended-list",
    defaultValue: false,
  });

  return (
    <ExperimentalContext.Provider
      value={{
        extendedList,

        toggleExtendedList: () => setExtendedList((val) => !val),
      }}
    >
      {children}
    </ExperimentalContext.Provider>
  );
};

export function useExperimentalContext(): ExperimentalContextType {
  const state = useContext(ExperimentalContext);
  if (!state) {
    throw new Error(
      `ERROR: Experimental reached invalid state, null 'experimental' in context`,
    );
  }
  return state;
}
