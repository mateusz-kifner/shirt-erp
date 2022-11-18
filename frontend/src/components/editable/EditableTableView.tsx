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

  const meta_id = Object.values(metadata)[0].id

  // FIXME: make memo refresh after changes to table
  const verify = useMemo(
    () =>
      Array.isArray(value) && value.length > 0
        ? metadataActions[0](value, meta_id)
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
                const inAABB =
                  boundingBox &&
                  rowIndex >= boundingBox.minY &&
                  rowIndex <= boundingBox.maxY &&
                  colIndex >= boundingBox.minX &&
                  colIndex <= boundingBox.maxX
                return (
                  <td
                    key={uuid + "_row_" + rowIndex + "_col_" + colIndex}
                    style={{
                      // border: "1px solid #333",
                      padding: 4,
                      minWidth: "3.92em",
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
                        ? getRandomColorByNumber(meta_id) + "88"
                        : undefined,

                      borderTop:
                        inAABB || val?.metaId == meta_id
                          ? "1px solid " + getRandomColorByNumber(meta_id)
                          : "1px solid #333",
                      borderLeft:
                        inAABB || val?.metaId == meta_id
                          ? "1px solid " + getRandomColorByNumber(meta_id)
                          : "1px solid #333",
                      borderRight:
                        colIndex === row.length - 1
                          ? inAABB || val?.metaId == meta_id
                            ? "1px solid " + getRandomColorByNumber(meta_id)
                            : "1px solid #333"
                          : undefined,

                      borderBottom:
                        rowIndex === value.length - 1
                          ? inAABB || val?.metaId == meta_id
                            ? "1px solid " + getRandomColorByNumber(meta_id)
                            : "1px solid #333"
                          : undefined,

                      // borderBottom:
                      //   inAABB && boundingBox?.maxX === rowIndex
                      //     ? "1px solid #f00"
                      //     : "1px solid #333",
                      // borderTop:
                      //   inAABB && boundingBox?.minX === rowIndex
                      //     ? "1px solid #f00"
                      //     : "1px solid #333",

                      // borderLeft:
                      //   inAABB && boundingBox?.minX === colIndex
                      //     ? "1px solid #f00"
                      //     : "1px solid #333",
                      // borderRight:
                      //   inAABB && boundingBox?.maxX === colIndex
                      //     ? "1px solid #f00"
                      //     : "1px solid #333",
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
