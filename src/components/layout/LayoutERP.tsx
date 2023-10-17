import { type PropsWithChildren } from "react";

import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { useUserContext } from "@/context/userContext";
import { useIsMobile } from "@/hooks/useIsMobile";

function LayoutERP({ children }: PropsWithChildren) {
  const { navigationCollapsed } = useUserContext();
  const isMobile = useIsMobile();

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

export default LayoutERP;
