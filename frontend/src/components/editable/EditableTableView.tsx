import React, { ComponentType, useId, useMemo } from "react"
import { Matrix } from "react-spreadsheet"
import { UniversalMatrix } from "../spreadsheet/useSpreadSheetData"
import { ScrollArea, useMantineTheme, Text } from "@mantine/core"
import isNumeric from "../../utils/isNumeric"
import { getRandomColorByNumber } from "../../utils/getRandomColor"
import { AABB2D } from "../../types/AABB"

function expandAABB(aabb: AABB2D, row: number, col: number) {
  let new_aabb = { ...aabb }
  console.log(aabb, row, col)
  if (row === aabb.minX - 1) {
    new_aabb.minX -= 1
  }
  if (col === aabb.minY - 1) {
    new_aabb.minY -= 1
  }
  if (row === aabb.maxX + 1) {
    new_aabb.maxX += 1
  }
  if (col === aabb.maxY + 1) {
    new_aabb.maxY += 1
  }
  return new_aabb
}

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
  ) =>
    | [UniversalMatrix, string]
    | [UniversalMatrix, string, AABB2D, { row: number; column: number }])[]
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
  const metaIdPosition = verify && verify?.length > 1 ? verify[3] : null
  const expandedBoundingBox =
    boundingBox && metaIdPosition
      ? expandAABB(boundingBox, metaIdPosition?.row, metaIdPosition?.column)
      : null

  if (verify === null || verify[1].startsWith("error")) {
    return <Text color="red">{verify?.[1] ?? ""}</Text>
  }

  return (
    <ScrollArea type="auto">
      <table
        style={{
          background: darkTheme ? "#000" : "#fff",
          padding: 0,
          margin: 0,
          borderSpacing: 0,
        }}
      >
        <tbody>
          {value?.map((row, rowIndex) => (
            <tr key={uuid + "_row_" + rowIndex}>
              {row.map((val, colIndex) => {
                const Icon = metadataIcons?.[val?.metaPropertyId ?? -1]
                const inAABB =
                  expandedBoundingBox &&
                  rowIndex >= expandedBoundingBox.minY &&
                  rowIndex <= expandedBoundingBox.maxY &&
                  colIndex >= expandedBoundingBox.minX &&
                  colIndex <= expandedBoundingBox.maxX
                if (!inAABB) return null
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

                      border:
                        (inAABB || val?.metaId == meta_id) && !!val?.value
                          ? "1px solid " + getRandomColorByNumber(meta_id)
                          : "1px solid #333",

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
