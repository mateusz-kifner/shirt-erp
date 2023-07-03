import type { MouseEvent, FC } from "react"
import classNames from "classnames"
import type { ColumnIndicatorProps } from "react-spreadsheet"
import { columnIndexToLabel } from "hot-formula-parser"

const ColumnIndicator = ({
  column,
  label,
  selected,
  onContextmenu,
}: ColumnIndicatorProps & {
  onContextmenu: (e: MouseEvent<HTMLDivElement>, column: number) => void
}) => {
  return (
    <th
      className={classNames("Spreadsheet__header", {
        "Spreadsheet__header--selected": selected,
      })}
      // onClick={handleClick}
      tabIndex={0}
      onContextMenu={(e) => onContextmenu(e, column)}
    >
      {label !== undefined ? label : columnIndexToLabel(String(column))}
    </th>
  )
}

export default ColumnIndicator

export const enhance = (
  ColumnIndicatorComponent: FC<
    ColumnIndicatorProps & {
      onContextmenu: (e: MouseEvent<HTMLDivElement>, column: number) => void
    }
  >,
  onContextmenu: (e: MouseEvent<HTMLDivElement>, column: number) => void
): FC<
  ColumnIndicatorProps & {
    onContextmenu: (e: MouseEvent<HTMLDivElement>, column: number) => void
  }
> => {
  return function ColumnIndicatorWrapper(props) {
    return <ColumnIndicatorComponent {...props} onContextmenu={onContextmenu} />
  }
}
