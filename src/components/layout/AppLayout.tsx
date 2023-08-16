import { useEffect, type PropsWithChildren } from "react";

import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { useUserContext } from "@/context/userContext";
import { useIsMobile } from "@/hooks/useIsMobile";

function Layout({ children }: PropsWithChildren) {
  const { navigationCollapsed } = useUserContext();
  const { isMobile } = useIsMobile();

  useEffect(() => {
    // initialize theme
    const theme = localStorage.getItem("user-theme");
    const htmlElement = document.querySelector("html") as HTMLHtmlElement;
    htmlElement.classList.add(theme === "0" ? "light" : "dark");

    // enable transitions after page load
    const timeout = setTimeout(() => {
      const bodyElement = document.querySelector("body") as HTMLBodyElement;
      bodyElement.classList.remove("preload");
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      <main
        className={`${
          isMobile ? "" : navigationCollapsed ? "pl-20" : "pl-64"
        } min-h-screen pt-14 transition-all`}
      >
        {children}
      </main>
      <Navigation />
      <Header />
    </div>
  );
}

export default Layout;
