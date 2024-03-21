import { type UseListStateHandlers, useListState } from "@mantine/hooks";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction, useState } from "react";

function useMultiTabsState(
  initialActive?: number,
  initialPinned?: number[],
  // cacheKey?: string,
): {
  active: number;
  pinned: number[];
  setActive: Dispatch<SetStateAction<number>>;
  pinnedHandler: UseListStateHandlers<number>;
} {
  const [active, setActive] = useState<number>(initialActive ?? 0);
  const [pinned, pinnedHandler] = useListState<number>(initialPinned ?? []);
  const router = useRouter();
  if (
    router.query["select-tab"] !== undefined &&
    !Array.isArray(router.query["select-tab"])
  ) {
    return {
      setActive,
      pinnedHandler,
      active: Number.parseInt(router.query["select-tab"]),
      pinned: [],
    };
  }

  return { active, pinned, setActive, pinnedHandler };
}

export default useMultiTabsState;
