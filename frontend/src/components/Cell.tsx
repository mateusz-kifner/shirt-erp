import {
  ReactElement,
  useMemo,
  useRef,
  MouseEvent,
  useCallback,
  useEffect,
  CSSProperties,
} from "react"
import {
  CellBase,
  CellComponentProps,
  Dimensions,
  Point,
} from "react-spreadsheet"
import { ColorSwatch, RulerMeasure } from "tabler-icons-react"

const icons = { ColorSwatch: ColorSwatch, RulerMeasure: RulerMeasure }

/** Get the offset values of given element */
export function getOffsetRect(element: HTMLElement): Dimensions {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
    left: element.offsetLeft,
    top: element.offsetTop,
  }
}

export const Cell = ({
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
}: CellComponentProps) => {
  const rootRef = useRef<HTMLTableCellElement | null>(null)
  const point = useMemo(
    (): Point => ({
      row,
      column,
    }),
    [row, column]
  )

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLTableCellElement>) => {
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

  const handleMouseOver = useCallback(
    (event: MouseEvent<HTMLTableCellElement>) => {
      if (dragging) {
        setCellDimensions(point, getOffsetRect(event.currentTarget))
        select(point)
      }
    },
    [setCellDimensions, select, dragging, point]
  )

  useEffect(() => {
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
  //@ts-ignore
  const Icon = icons[data?.icon]
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
      {/* @ts-ignore */}
      {data?.icon && (
        <Icon size={12} style={{ position: "absolute", top: 0, right: 0 }} />
      )}
      <DataViewer
        row={row}
        column={column}
        cell={data}
        formulaParser={formulaParser}
        setCellData={function (cell: CellBase<any>): void {
          throw new Error("Function not implemented.")
        }}
      />
    </td>
  )
}
