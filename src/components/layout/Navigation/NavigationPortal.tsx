import { type ReactNode, useEffect, useState } from "react";
import * as Portal from "@radix-ui/react-portal";

interface NavigationPortalProps {
  children: ReactNode;
}

function NavigationPortal(props: NavigationPortalProps) {
  const { children } = props;
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(
      document.querySelector("#NavigationPortalTarget") as HTMLElement | null,
    );
  }, [
    typeof document !== "undefined" &&
      (document.querySelector("#NavigationPortalTarget") as HTMLElement | null),
  ]);

  return (
    <Portal.Root container={portalTarget} className="flex grow flex-col">
      {children}
    </Portal.Root>
  );
}

export default NavigationPortal;
