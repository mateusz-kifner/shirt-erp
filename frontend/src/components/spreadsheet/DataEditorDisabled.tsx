import type { DataEditorProps } from "react-spreadsheet"
import { convertBooleanToText } from "./DataViewer"
import isNumeric from "../../utils/isNumeric"
import type { FC } from "react"

/** The default Spreadsheet DataEditor component */
const DataEditorDisabled: FC<DataEditorProps> = ({ cell }) => {
  const value = cell?.value ?? ""
  return typeof value === "boolean" ? (
    <span className="Spreadsheet__data-viewer Spreadsheet__data-viewer--boolean Spreadsheet__data-viewer--disabled">
      {convertBooleanToText(value)}
    </span>
  ) : (
    <span
      className="Spreadsheet__data-viewer Spreadsheet__data-viewer--disabled"
      style={{ textAlign: isNumeric(value) ? "right" : "left" }}
    >
      {/* @ts-ignore*/}
      {value}
    </span>
  )
}

export default DataEditorDisabled
