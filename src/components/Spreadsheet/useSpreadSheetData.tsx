import { useState } from "react";
import type { PointRange, CellBase, Matrix } from "react-spreadsheet";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UniversalCell = CellBase & { [key: string]: any };

export type UniversalMatrix = Matrix<UniversalCell>;

export interface UseSpreadSheetDataHandlers {
  setData: React.Dispatch<React.SetStateAction<UniversalMatrix>>;
  addColumn: (column: number) => void;
  removeColumn: (column: number) => void;
  addRow: (row: number) => void;
  removeRow: (row: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMetadata: (
    selection: PointRange,
    metadata: { [key: string]: any },
  ) => void;
  clearMetadata: (selection: PointRange) => void;
  clearAllMetadata: () => void;
}

export type UseSpreadSheetData = [UniversalMatrix, UseSpreadSheetDataHandlers];

// rebuild metadata controls

export function useSpreadSheetData(
  initialValue: UniversalMatrix = [
    [undefined, undefined],
    [undefined, undefined],
  ],
): UseSpreadSheetData {
  const [data, setData] = useState<UniversalMatrix>(initialValue);

  const addColumn = (column: number) => {
    setData((data) => [
      ...data.map((val) => [
        ...val.slice(0, column),
        undefined,
        ...val.slice(column),
      ]),
    ]);
  };

  const removeRow = (row: number) => {
    if (data.length > 2) {
      setData((data) => data.filter((_, index) => row !== index));
    }
  };

  const addRow = (row: number) => {
    setData((data) => [
      ...data.slice(0, row),
      data[0]?.map(() => undefined),
      ...data.slice(row),
    ]);
  };

  const removeColumn = (column: number) => {
    if (data[0]?.length > 2) {
      setData((data) =>
        data.map((val) => val.filter((_, index) => column !== index)),
      );
    }
  };

  const setMetadata = (
    selection: PointRange,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: { [key: string]: any },
  ) => {
    const new_data: UniversalMatrix = [
      ...data.map((val) => [
        ...val.map((val2) =>
          val2
            ? {
                ...val2,
              }
            : undefined,
        ),
      ]),
    ];

    for (const point of selection) {
      new_data[point.row]![point.column] = {
        ...(new_data[point.row]?.[point.column] as UniversalCell),
        ...metadata,
      };
    }
    setData(new_data);
  };

  const clearMetadata = (selection: PointRange) => {
    const new_data: UniversalMatrix = [
      ...data.map((val) => [
        ...val.map((val2) =>
          val2
            ? {
                ...val2,
              }
            : undefined,
        ),
      ]),
    ];

    for (const point of selection) {
      new_data[point.row]![point.column] = new_data[point.row]?.[point.column]
        ? {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            value:
              (new_data[point.row]?.[point.column] as { value: string })
                .value ?? "",
          }
        : undefined;
    }
    setData(new_data);
  };

  const clearAllMetadata = () => {
    const new_data: UniversalMatrix = [
      ...data.map((val) => [
        ...val.map((val2) =>
          val2
            ? {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                value: val2?.value ?? "",
              }
            : undefined,
        ),
      ]),
    ];
    setData(new_data);
  };

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
  ];
}
