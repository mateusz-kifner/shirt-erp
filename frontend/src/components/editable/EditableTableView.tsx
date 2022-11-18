import React, { ComponentType, useId, useMemo } from "react"
import { CellBase, CellComponent, Matrix } from "react-spreadsheet"
import DataViewer from "../spreadsheet/DataViewer"
import { UniversalMatrix } from "../spreadsheet/useSpreadSheetData"
import { Parser as FormulaParser } from "hot-formula-parser"
import { Cell, enhance as enhanceCell } from "../spreadsheet/Cell"
import { ScrollArea, useMantineTheme } from "@mantine/core"
import DataEditorDisabled from "../spreadsheet/DataEditorDisabled"
import { merge } from "lodash"
import isNumeric from "../../utils/isNumeric"
import { getRandomColorByNumber } from "../../utils/getRandomColor"

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
    <ScrollArea type="auto">
      <table
        style={{
          borderCollapse: "collapse",
          background: theme.colorScheme === "dark" ? "#000" : "#fff",
        }}
      >
        <tbody>
          {value?.map((row, rowIndex) => (
            <tr key={uuid + "_row_" + rowIndex}>
              {row.map((val, colIndex) => {
                console.log(val, rowIndex, colIndex)

                const Icon = metadataIcons?.[val?.metaPropertyId ?? -1]

                return (
                  <td
                    key={uuid + "_row_" + rowIndex + "_col_" + colIndex}
                    style={{
                      border: "1px solid #333",
                      padding: 4,
                      minWidth: "2.92em",
                      minHeight: "1.9em",
                      height: "1.9em",
                      maxHeight: "1.9em",
                      overflow: "hidden",
                      wordBreak: "keep-all",
                      whiteSpace: "nowrap",
                      textAlign: isNumeric(val?.value) ? "right" : "left",
                      boxSizing: "border-box",
                      position: "relative",
                      background: val?.metaId
                        ? getRandomColorByNumber(val.metaId) + "88"
                        : undefined,
                    }}
                  >
                    {Icon && (
                      <Icon
                        // @ts-ignore
                        size={12}
                        style={{ position: "absolute", top: 0, right: 0 }}
                      />
                    )}
                    {val?.value ?? ""}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  )
}

export default EditableTableView
