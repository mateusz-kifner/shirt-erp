import { type ReactNode, useEffect, useState } from "react";
import * as Portal from "@radix-ui/react-portal";
import { IsInsideNavigationContextProvider } from "./isInsideNavigationContext";

interface NavigationPortalProps {
  children: ReactNode;
}

function NavigationPortal(props: NavigationPortalProps) {
  const { children } = props;
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: It's nesesery
  useEffect(() => {
    setPortalTarget(
      document.querySelector("#NavigationPortalTarget") as HTMLElement | null,
    );
  }, [
    typeof document !== "undefined" &&
      (document.querySelector("#NavigationPortalTarget") as HTMLElement | null),
  ]);

  return (
    <IsInsideNavigationContextProvider>
      <Portal.Root container={portalTarget} className="flex grow flex-col">
        {children}
      </Portal.Root>
    </IsInsideNavigationContextProvider>
  );
}

export default NavigationPortal;
