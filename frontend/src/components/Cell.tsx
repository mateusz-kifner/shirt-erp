import * as React from "react"
import { CellComponentProps, Dimensions, Point } from "react-spreadsheet"

/** Get the offset values of given element */
export function getOffsetRect(element: HTMLElement): Dimensions {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
    left: element.offsetLeft,
    top: element.offsetTop,
  }
}

export const Cell: React.FC<CellComponentProps> = ({
  row,
  column,
  DataViewer,
  formulaParser,
  selected,
  active,
  dragging,
  mode,
  data,
  select,
  activate,
  setCellDimensions,
}): React.ReactElement => {
  const rootRef = React.useRef<HTMLTableCellElement | null>(null)
  const point = React.useMemo(
    (): Point => ({
      row,
      column,
    }),
    [row, column]
  )

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLTableCellElement>) => {
      if (mode === "view") {
        setCellDimensions(point, getOffsetRect(event.currentTarget))

        if (event.shiftKey) {
          select(point)
        } else {
          activate(point)
        }
      }
    },
    [mode, setCellDimensions, point, select, activate]
  )

  const handleMouseOver = React.useCallback(
    (event: React.MouseEvent<HTMLTableCellElement>) => {
      if (dragging) {
        setCellDimensions(point, getOffsetRect(event.currentTarget))
        select(point)
      }
    },
    [setCellDimensions, select, dragging, point]
  )

  React.useEffect(() => {
    const root = rootRef.current
    if (selected && root) {
      setCellDimensions(point, getOffsetRect(root))
    }
    if (root && active && mode === "view") {
      root.focus()
    }
  }, [setCellDimensions, selected, active, mode, point, data])

  if (data && data.DataViewer) {
    // @ts-ignore
    DataViewer = data.DataViewer
  }

  return (
    <td
      ref={rootRef}
      className={"Spreadsheet__cell"}
      // @ts-ignore
      style={data?.style}
      onMouseOver={handleMouseOver}
      onMouseDown={handleMouseDown}
      tabIndex={0}
    >
      <DataViewer
        row={row}
        column={column}
        cell={data}
        formulaParser={formulaParser}
      />
    </td>
  )
}
