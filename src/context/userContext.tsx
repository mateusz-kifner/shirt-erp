import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { useLocalStorage, useMediaQuery } from "@mantine/hooks";

interface UserContextType {
  debug: boolean;
  navigationCollapsed: boolean;
  theme: number;
  toggleTheme: () => void;
  toggleNavigationCollapsed: () => void;
  setNavigationCollapsed: Dispatch<SetStateAction<boolean>>;
  toggleDebug: () => void;
  mobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;

  smallScreen: boolean;
  hasTouch: boolean;
  isMobile: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [debug, setDebug] = useLocalStorage<boolean>({
    key: "user-debug",
    defaultValue: false,
  });
  const [navigationCollapsed, setNavigationCollapsed] =
    useLocalStorage<boolean>({
      key: "user-navigation-collapsed",
      defaultValue: false,
    });
  const [theme, setTheme] = useLocalStorage<number>({
    key: "user-theme",
    defaultValue: 0,
  });

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // const [secondNavigation, setSecondNavigation] = useLocalStorage<boolean>({
  //   key: "user-navigation-second",
  //   defaultValue: false,
  // });

  const smallScreen = useMediaQuery("(max-width: 768px)", true);
  const hasTouch = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)",
    true,
  );

  return (
    <UserContext.Provider
      value={{
        theme,
        debug,
        navigationCollapsed,
        toggleNavigationCollapsed: () => setNavigationCollapsed((val) => !val),
        toggleTheme: () => {
          setTheme((val) => (val === 0 ? 1 : 0));
          const htmlElement = document.querySelector("html") as HTMLHtmlElement;
          htmlElement.classList.remove("light", "dark");
          htmlElement.classList.add(theme === 1 ? "light" : "dark");
        },
        setNavigationCollapsed,
        toggleDebug: () => setDebug((val) => !val),
        mobileOpen,
        setMobileOpen,
        smallScreen,
        hasTouch,
        isMobile: smallScreen || hasTouch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext(): UserContextType {
  const state = useContext(UserContext);
  if (!state) {
    throw new Error(
      `ERROR: User reached logged-in-only component with null 'user' in context`,
    );
  }
  return state;
}
