import { useState } from "react";

interface useApiListTableStateProps {
  initialChecked?: number[];
  initialSort?: { id?: string; desc?: boolean };
}

function useApiListTableState(props: useApiListTableStateProps = {}) {
  const checkedState = useState<number[]>(props.initialChecked ?? []);
  const sortState = useState<{ id?: string; desc?: boolean }>({
    id: props.initialSort?.id,
    desc: props.initialSort?.desc ?? true,
  });
  return {
    checkedState,
    sortState,
  };
}

export { useApiListTableState };
