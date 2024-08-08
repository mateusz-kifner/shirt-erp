import { useEffect, useState, useRef } from "react";

/**
 * Checks if HTMLElement has children or not
 * It can be use to check if portal target is populated 
 */

export function useHasChildNodes<T extends HTMLElement>() {
  const [hasChildren, setHasChildren] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      setHasChildren(ref.current?.hasChildNodes() ?? false);
    });

    // Observe changes to the element and its subtree
    if (ref.current) {
      observer.observe(ref.current, { childList: true, subtree: true });
    }

    // Cleanup function to disconnect the observer
    return () => observer.disconnect();
  }, [ref]);

  return { ref, hasChildren };
}
