import React, { ComponentType, useId } from "react"
import { Matrix } from "react-spreadsheet"
import { UniversalMatrix } from "../spreadsheet/useSpreadSheetData"

interface EditableTableProps {
  label?: string
  value?: Matrix<any>
  initialValue?: Matrix<any>
  onSubmit?: (value: Matrix<any> | null) => void
  disabled?: boolean
  required?: boolean
  metadataIcons?: ComponentType[]
  metadataLabels?: string[]
  metadata: {
    [key: string]: {
      id: number
      [key: string]: any
    }
  }
  metadataActions: ((
    table: UniversalMatrix,
    metaId: number
  ) => [UniversalMatrix, string])[]
  metadataActionIcons: ComponentType[]
  metadataActionLabels?: string[]
}

const EditableTableView = (props: EditableTableProps) => {
  const { value } = props
  const uuid = useId()
  return (
    <table style={{ borderCollapse: "collapse" }}>
      {value?.map((row, rowIndex) => (
        <tr key={uuid + "_row_" + rowIndex}>
          {row.map((val, colIndex) => (
            <td
              key={uuid + "_row_" + rowIndex + "_col_" + colIndex}
              style={{ border: "1px solid black" }}
            >
              {val?.value ?? ""}
            </td>
          ))}
        </tr>
      ))}
    </table>
  )
}

export default EditableTableView
