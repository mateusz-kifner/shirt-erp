import * as React from "react"
import { DataEditorProps } from "react-spreadsheet"
import { convertBooleanToText } from "./DataViewer"
import isNumeric from "../../utils/isNumeric"

/** The default Spreadsheet DataEditor component */
const DataEditorDisabled: React.FC<DataEditorProps> = ({ onChange, cell }) => {
  const value = cell?.value ?? ""
  return typeof value === "boolean" ? (
    <span className="Spreadsheet__data-viewer Spreadsheet__data-viewer--boolean Spreadsheet__data-viewer--disabled">
      {convertBooleanToText(value)}
    </span>
  ) : (
    <span
      className="Spreadsheet__data-viewer Spreadsheet__data-viewer--disabled" // @ts-ignore
      style={{ textAlign: isNumeric(value) ? "right" : "left" }}
    >
      {/* @ts-ignore*/}
      {value}
    </span>
  )
}

export default DataEditorDisabled
