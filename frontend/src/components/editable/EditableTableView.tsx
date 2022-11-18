import React, { ComponentType, useId, useMemo } from "react"
import { CellBase, CellComponent, Matrix } from "react-spreadsheet"
import DataViewer from "../spreadsheet/DataViewer"
import { UniversalMatrix } from "../spreadsheet/useSpreadSheetData"
import { Parser as FormulaParser } from "hot-formula-parser"
import { Cell, enhance as enhanceCell } from "../spreadsheet/Cell"
import { useMantineTheme } from "@mantine/core"
import DataEditorDisabled from "../spreadsheet/DataEditorDisabled"
import { merge } from "lodash"

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
  const { value, metadataIcons } = props
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

  const EnhancedCell = useMemo(
    () => enhanceCell(Cell, metadataIcons ?? []) as unknown as CellComponent,
    [metadataIcons]
  )
  return (
    <table style={{ borderCollapse: "collapse" }}>
      {value?.map((row, rowIndex) => (
        <tr key={uuid + "_row_" + rowIndex}>
          {row.map((val, colIndex) => {
            console.log(val, rowIndex, colIndex)
            return (
              <EnhancedCell
                key={uuid + "_row_" + rowIndex + "_col_" + colIndex}
                column={colIndex}
                row={rowIndex}
                formulaParser={formulaParser}
                // @ts-ignore
                DataViewer={DataViewer}
                // @ts-ignore
                DataEditor={DataEditorDisabled}
                data={{
                  ...val,
                  style: merge(val?.style, { border: "1px solid #333" }),
                }}
              />
            )
          })}
        </tr>
      ))}
    </table>
  )
}

export default EditableTableView
