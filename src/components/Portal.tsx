import React, { useRef, useState, type ReactPortal } from "react";
import { createPortal } from "react-dom";

import { useIsomorphicEffect } from "@mantine/hooks";

// mantine portal helper component remixed

export interface PortalProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Portal children, for example, modal or popover */
  children: React.ReactNode;

  /** Element where portal should be rendered, by default new div element is created and appended to document.body */
  target?: HTMLElement | string;

  /** Root element className */
  className?: string;

  /** Root element ref */
  innerRef?: React.MutableRefObject<HTMLDivElement | null>;
}

function Portal(props: PortalProps): ReactPortal | null {
  const { children, target, className, innerRef, ...others } = props;

  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useIsomorphicEffect(() => {
    setMounted(true);
    ref.current = !target
      ? document.createElement("div")
      : typeof target === "string"
      ? document.querySelector(target)
      : target;

    if (!target) {
      document.body.appendChild(ref.current!);
    }

    return () => {
      !target && document.body.removeChild(ref.current!);
    };
  }, [target]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className={className} {...others} ref={innerRef}>
      {children}
    </div>,
    ref.current!
  );
}

export default Portal;
