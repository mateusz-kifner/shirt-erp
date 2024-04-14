import { createContext, useContext, type ReactNode } from "react";

// WARNING: This context is used for detecting

export const IsInsideNavigationContext = createContext<true | null>(null);

export const IsInsideNavigationContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <IsInsideNavigationContext.Provider value={true}>
      {children}
    </IsInsideNavigationContext.Provider>
  );
};

export function useIsInsideNavigation(): true | null {
  const state = useContext(IsInsideNavigationContext);
  // if (!state) {
  //   throw new Error(
  //     `ERROR: Navigation reached invalid state, null 'navigation' in context`,
  //   );
  // }
  return state;
}
