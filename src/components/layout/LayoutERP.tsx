import { type PropsWithChildren } from "react";

import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { useUserContext } from "@/context/userContext";
import { useIsMobile } from "@/hooks/useIsMobile";

function LayoutERP({ children }: PropsWithChildren) {
  const isMobile = useIsMobile();

  return (
    <div>
      <Header />

      <main
        className={`${
          isMobile ? "" : "pl-[5.5rem]"
        } min-h-screen pt-14 transition-all`}
      >
        {children}
      </main>
      <Navigation />
    </div>
  );
}

export default LayoutERP;
