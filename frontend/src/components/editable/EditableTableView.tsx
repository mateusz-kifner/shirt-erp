import React, { ComponentType, useId } from "react"
import { CellBase, Matrix } from "react-spreadsheet"
import DataViewer from "../spreadsheet/DataViewer"
import { UniversalMatrix } from "../spreadsheet/useSpreadSheetData"
import { Parser as FormulaParser } from "hot-formula-parser"
import { Cell } from "../spreadsheet/Cell"
import { useMantineTheme } from "@mantine/core"
import DataEditorDisabled from "../spreadsheet/DataEditorDisabled"

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
  const theme = useMantineTheme()
  const darkTheme = theme.colorScheme === "dark"

  const formulaParser = React.useMemo(() => new FormulaParser(), [])

  React.useEffect(() => {
    formulaParser.on("callCellValue", (cellCoord, done) => {})
    formulaParser.on(
      "callRangeValue",
      (startCellCoord, endCellCoord, done) => {}
    )
  }, [formulaParser])
  return (
    <table style={{ borderCollapse: "collapse" }}>
      {value?.map((row, rowIndex) => (
        <tr key={uuid + "_row_" + rowIndex}>
          {row.map((val, colIndex) => (
            <Cell
              key={uuid + "_row_" + rowIndex + "_col_" + colIndex}
              column={colIndex}
              row={rowIndex}
              formulaParser={formulaParser}
              darkMode={darkTheme}
              className="Spreadsheet"
              // @ts-ignore
              DataViewer={DataViewer}
              DataEditor={DataEditorDisabled}
              data={val}
            />
          ))}
        </tr>
      ))}
    </table>
  )
}

export default EditableTableView
