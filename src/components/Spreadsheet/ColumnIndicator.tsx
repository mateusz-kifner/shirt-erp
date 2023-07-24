import classNames from "classnames";
import { useCallback, type FC, type ReactNode } from "react";
import type { ColumnIndicatorProps } from "react-spreadsheet";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "../ui/ContextMenu";

const ColumnIndicator = (props: ColumnIndicatorProps & {
  contextMenu: ReactNode;
}) => {
  const {
    column,
    label,
    selected,
    contextMenu,
    onSelect
  } = props
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      onSelect(column, event.shiftKey);
    },
    [onSelect, column]
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
      {label !== undefined ? label : columnIndexToLabel(column)}
    </th>
    </ContextMenuTrigger>
    <ContextMenuContent>
      {contextMenu}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ColumnIndicator;

export const enhance = (
  ColumnIndicatorComponent: FC<
    ColumnIndicatorProps & {
      contextMenu: ReactNode;
    }
  >,
  contextMenu: ReactNode
): FC<
  ColumnIndicatorProps& {
    contextMenu: ReactNode;
  }
> => {
  return function ColumnIndicatorWrapper(props) {
    return (
      <ColumnIndicatorComponent {...props} contextMenu={contextMenu} />
    );
  };
};

function columnIndexToLabel(column: number): string {
  let label = "";
  let index = column;
  while (index >= 0) {
    label = String.fromCharCode(65 + (index % 26)) + label;
    index = Math.floor(index / 26) - 1;
  }
  return label;
}