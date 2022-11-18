import { AABB2D } from "../../types/AABB"
import isNumeric from "../../utils/isNumeric"
import { UniversalMatrix } from "./useSpreadSheetData"

function verifyMetadata(table: UniversalMatrix, metaId: number) {
  let row = -1
  let rowId = -1
  let column = -1
  let columnId = -1

  let rowMin = -1
  let rowMax = -1

  let columnMin = -1
  let columnMax = -1
  // find row & column
  for (let y = 0; y < table.length; y++) {
    for (let x = 0; x < table[0].length; x++) {
      if (table[y][x]?.metaId === metaId) {
        if (table[y][x]?.metaPropertyId !== undefined) {
          if (row === -1) {
            if (
              x < table[0].length - 1 &&
              table[y][x]?.metaPropertyId === table[y][x + 1]?.metaPropertyId
            ) {
              row = y
              rowId = table[y][x]?.metaPropertyId
            }
          }
          if (column === -1) {
            if (
              y < table.length - 1 &&
              table[y][x]?.metaPropertyId === table[y + 1][x]?.metaPropertyId
            ) {
              column = x
              columnId = table[y][x]?.metaPropertyId
            }
          }
        }
      }
    }
  }
  // check if all metadata is present the same orientation
  for (let y = 0; y < table.length; y++) {
    for (let x = 0; x < table[0].length; x++) {
      if (table[y][x]?.metaId === metaId) {
        if (table[y][x]?.metaPropertyId !== undefined) {
          if (row === y) {
            if (rowMin === -1) rowMin = x
            rowMax = x
          } else if (table[y][x]?.metaPropertyId === rowId) {
            return [
              table,
              "error: Metadane z jednej kategorii istnieją w 2 wierszach",
            ]
          }
          if (column === x) {
            if (columnMin === -1) columnMin = y
            columnMax = y
          } else if (table[y][x]?.metaPropertyId === columnId) {
            return [
              table,
              "error: Metadane z jednej kategorii istnieją w 2 kolumnach",
            ]
          }
        }
      }
    }
  }
  if (columnMin === -1 || columnMax === -1 || rowMin === -1 || rowMax === -1)
    return [table, "error: Tablica nie ma danego typu"]

  for (let y = columnMin; y < columnMax + 1; y++) {
    for (let x = rowMin; x < rowMax + 1; x++) {
      if (table[y][x]?.metaId !== undefined && table[y][x]?.metaId !== metaId) {
        return [table, "error: Tablica ma pomieszane metadane 2 typów"]
      }
      if (
        table[y][x]?.metaId === undefined &&
        table[y][x]?.value &&
        table[y][x]?.value?.length > 0 &&
        !isNumeric(table[y][x]?.value)
      ) {
        return [
          table,
          "error: Tablica ma nieliczbowe dane w granicach wyznaczonych przez metadane",
        ]
      }
    }
  }

  return [
    table,
    "success: Tablica mam poprawne metadane",
    { minX: rowMin, maxX: rowMax, minY: columnMin, maxY: columnMax } as AABB2D,
    { row: column, column: row },
  ]
}

export default verifyMetadata
