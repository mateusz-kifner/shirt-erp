import { execPath } from "process"
import {
  CellBase,
  DataViewerProps,
  Dimensions,
  getComputedValue,
} from "react-spreadsheet"
import isNumeric from "../../utils/isNumeric"

/** Get the offset values of given element */
export function getOffsetRect(element: HTMLElement): Dimensions {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
    left: element.offsetLeft,
    top: element.offsetTop,
  }
}

export const TRUE_TEXT = "TRUE"
export const FALSE_TEXT = "FALSE"

/** The default Spreadsheet DataViewer component */
const DataViewer = <Cell extends CellBase<Value>, Value>({
  cell,
  formulaParser,
}: DataViewerProps<Cell>) => {
  let value = cell?.value ?? ""

  // value = getComputedValue<Cell, Value>({ cell, formulaParser })

  return typeof value === "boolean" ? (
    <span className="Spreadsheet__data-viewer Spreadsheet__data-viewer--boolean">
      {convertBooleanToText(value)}
    </span>
  ) : (
    <span
      className="Spreadsheet__data-viewer"
      style={{ textAlign: isNumeric(value) ? "right" : "left" }}
    >
      {/* @ts-ignore*/}
      {value}
    </span>
  )
}

export default DataViewer

export function convertBooleanToText(value: boolean): string {
  return value ? TRUE_TEXT : FALSE_TEXT
}
