import classNames from "classnames";
import { useCallback, type FC, type MouseEvent, type ReactNode } from "react";

import { RowIndicatorProps } from "react-spreadsheet";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../ui/ContextMenu";

const RowIndicator = (
  props: RowIndicatorProps & {
    contextMenu: (row: number) => ReactNode;
  }
) => {
  const { row, label, selected, contextMenu, onSelect } = props;
  const handleClick = useCallback(
    (event: MouseEvent) => {
      onSelect(row, event.shiftKey);
    },
    [onSelect, row]
  );
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <th
          className={classNames("Spreadsheet__header", {
            "Spreadsheet__header--selected": selected,
          })}
          onClick={handleClick}
          tabIndex={0}
        >
          {label !== undefined ? label : row + 1}
        </th>
      </ContextMenuTrigger>
      <ContextMenuContent>{contextMenu(row)}</ContextMenuContent>
    </ContextMenu>
  );
};

export default RowIndicator;

export const enhance = (
  RowIndicatorComponent: FC<
    RowIndicatorProps & {
      contextMenu: (row: number) => ReactNode;
    }
  >,
  contextMenu: (row: number) => ReactNode
): FC<
  RowIndicatorProps & {
    contextMenu: (row: number) => ReactNode;
  }
> => {
  return function RowIndicatorWrapper(props) {
    return <RowIndicatorComponent {...props} contextMenu={contextMenu} />;
  };
};
