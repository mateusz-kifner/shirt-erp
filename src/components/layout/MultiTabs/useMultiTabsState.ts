import { UseListStateHandlers, useListState } from "@mantine/hooks";
import { Dispatch, SetStateAction, useState } from "react";

function useMultiTabsState<T>(
  initialActive?: number,
  initialPinned?: number[],
): {
  active: number;
  pinned: number[];
  setActive: Dispatch<SetStateAction<number>>;
  pinnedHandler: UseListStateHandlers<number>;
} {
  const [active, setActive] = useState<number>(initialActive ?? 0);
  const [pinned, pinnedHandler] = useListState<number>(initialPinned ?? []);

  return { active, pinned, setActive, pinnedHandler };
}

export default useMultiTabsState;
