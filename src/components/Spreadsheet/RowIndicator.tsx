import type { MouseEvent, FC } from "react"
import classNames from "classnames"

import { RowIndicatorProps } from "react-spreadsheet"

const RowIndicator = ({
  row,
  label,
  selected,
  onContextmenu,
}: RowIndicatorProps & {
  onContextmenu: (e: MouseEvent<HTMLDivElement>, row: number) => void
}) => {
  return (
    <th
      className={classNames("Spreadsheet__header", {
        "Spreadsheet__header--selected": selected,
      })}
      tabIndex={0}
      onContextMenu={(e) => onContextmenu(e, row)}
    >
      {label !== undefined ? label : row + 1}
    </th>
  )
}

export default RowIndicator

export const enhance = (
  RowIndicatorComponent: FC<
    RowIndicatorProps & {
      onContextmenu: (e: MouseEvent<HTMLDivElement>, row: number) => void
    }
  >,
  onContextmenu: (e: MouseEvent<HTMLDivElement>, row: number) => void
): FC<
  RowIndicatorProps & {
    onContextmenu: (e: MouseEvent<HTMLDivElement>, row: number) => void
  }
> => {
  return function RowIndicatorWrapper(props) {
    return <RowIndicatorComponent {...props} onContextmenu={onContextmenu} />
  }
}
