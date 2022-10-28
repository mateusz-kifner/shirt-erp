import { useState } from "react"
import { CellBase, Matrix, Point } from "react-spreadsheet"

export type UniversalCell = CellBase & { [key: string]: any }

export type UniversalMatrix = Matrix<UniversalCell>

export interface UseSpreadSheetDataHandlers {
  setData: React.Dispatch<React.SetStateAction<UniversalMatrix>>
  addColumn: (column: number) => void
  removeColumn: (column: number) => void
  addRow: (row: number) => void
  removeRow: (row: number) => void
  setMetadata: (selection: Point[], metadata: { [key: string]: any }) => void
  clearMetadata: (selection: Point[]) => void
  clearAllMetadata: () => void
}

export type UseSpreadSheetData = [UniversalMatrix, UseSpreadSheetDataHandlers]

export function useSpreadSheetData(
  initialValue: UniversalMatrix = [
    [undefined, undefined],
    [undefined, undefined],
  ]
): UseSpreadSheetData {
  const [data, setData] = useState<UniversalMatrix>(initialValue)

  const addColumn = (column: number) => {
    setData((data) => [
      ...data.map((val, index) => [
        ...val.slice(0, column),
        undefined,
        ...val.slice(column),
      ]),
    ])
  }

  const removeRow = (row: number) => {
    if (data.length > 2) {
      setData((data) => data.filter((_, index) => row !== index))
    }
  }

  const addRow = (row: number) => {
    setData((data) => [
      ...data.slice(0, row),
      data[0].map(() => undefined),
      ...data.slice(row),
    ])
  }

  const removeColumn = (column: number) => {
    if (data[0].length > 2) {
      setData((data) =>
        data.map((val) => val.filter((_, index) => column !== index))
      )
    }
  }

  const setMetadata = (
    selection: Point[],
    metadata: { [key: string]: any }
  ) => {
    let new_data: UniversalMatrix = [
      ...data.map((val) => [
        ...val.map((val2) =>
          val2
            ? {
                ...val2,
              }
            : undefined
        ),
      ]),
    ]

    for (let point of selection) {
      new_data[point.row][point.column] = {
        ...(new_data[point.row][point.column] as UniversalCell),
        ...metadata,
      }
    }
    setData(new_data)
  }

  const clearMetadata = (selection: Point[]) => {
    let new_data: UniversalMatrix = [
      ...data.map((val) => [
        ...val.map((val2) =>
          val2
            ? {
                ...val2,
              }
            : undefined
        ),
      ]),
    ]

    for (let point of selection) {
      new_data[point.row][point.column] = new_data[point.row][point.column]
        ? {
            value: (new_data[point.row][point.column] as any).value ?? "",
          }
        : undefined
    }
    setData(new_data)
  }

  const clearAllMetadata = () => {
    let new_data: UniversalMatrix = [
      ...data.map((val) => [
        ...val.map((val2) =>
          val2
            ? {
                value: val2?.value ?? "",
              }
            : undefined
        ),
      ]),
    ]
    setData(new_data)
  }

  return [
    data,
    {
      setData,
      addColumn,
      removeColumn,
      addRow,
      removeRow,
      setMetadata,
      clearMetadata,
      clearAllMetadata,
    },
  ]
}
