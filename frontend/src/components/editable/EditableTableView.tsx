import React, { ComponentType, useId, useMemo } from "react"
import { Matrix } from "react-spreadsheet"
import { UniversalMatrix } from "../spreadsheet/useSpreadSheetData"
import { ScrollArea, useMantineTheme, Text } from "@mantine/core"
import isNumeric from "../../utils/isNumeric"
import { getRandomColorByNumber } from "../../utils/getRandomColor"
import { AABB2D } from "../../types/AABB"

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
  ) => [UniversalMatrix, string] | [UniversalMatrix, string, AABB2D])[]
  metadataActionIcons: ComponentType[]
  metadataActionLabels?: string[]
}

const EditableTableView = (props: EditableTableProps) => {
  const { value, metadataIcons, metadataActions, metadata } = props
  const uuid = useId()
  const theme = useMantineTheme()
  const darkTheme = theme.colorScheme === "dark"
  // FIXME: make memo refresh after changes to table
  const verify = useMemo(
    () =>
      Array.isArray(value) && value.length > 0
        ? metadataActions[0](value, Object.values(metadata)[0].id)
        : null,
    //eslint-disable-next-line
    [metadata, value]
  )
  const boundingBox = verify && verify?.length > 1 ? verify[2] : null
  console.log(verify, boundingBox)

  if (verify === null || verify[1].startsWith("error")) {
    return <Text color="red">{verify?.[1] ?? ""}</Text>
  }

  return (
    <ScrollArea type="auto">
      <table
        style={{
          borderCollapse: "collapse",
          background: darkTheme ? "#000" : "#fff",
        }}
      >
        <tbody>
          {value?.map((row, rowIndex) => (
            <tr key={uuid + "_row_" + rowIndex}>
              {row.map((val, colIndex) => {
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
      <div
        style={{
          height: 12,
        }}
      ></div>
    </ScrollArea>
  )
}

export default EditableTableView
