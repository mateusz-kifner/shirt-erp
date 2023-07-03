import React, { ComponentType, useId, useMemo } from "react";

import { CellBase, Matrix } from "react-spreadsheet";
import { AABB2D } from "../../types/AABB";
import {
  getColorByName,
  getRandomColorByNumber,
} from "../../utils/getRandomColor";
import isNumeric from "../../utils/isNumeric";
import { UniversalMatrix } from "../spreadsheet/useSpreadSheetData";

import type EditableInput from "../../types/EditableInput";

function expandAABB(aabb: AABB2D, row: number, col: number) {
  let new_aabb = { ...aabb };
  if (row === aabb.minX - 1) {
    new_aabb.minX -= 1;
  }
  if (col === aabb.minY - 1) {
    new_aabb.minY -= 1;
  }
  if (row === aabb.maxX + 1) {
    new_aabb.maxX += 1;
  }
  if (col === aabb.maxY + 1) {
    new_aabb.maxY += 1;
  }
  return new_aabb;
}

interface EditableTableProps extends EditableInput<Matrix<any>> {
  metadataIcons?: ComponentType[];
  metadataLabels?: string[];
  metadata: {
    [key: string]: {
      id: number;
      [key: string]: any;
    };
  };
  metadataActions: ((
    table: UniversalMatrix,
    metaId: number
  ) =>
    | [UniversalMatrix, string]
    | [UniversalMatrix, string, AABB2D, { row: number; column: number }])[];
  metadataActionIcons: ComponentType[];
  metadataActionLabels?: string[];
}

const EditableTableView = (props: EditableTableProps) => {
  const { value, metadataIcons, metadataActions, metadata, onSubmit } = props;
  const uuid = useId();
  const theme = useMantineTheme();
  const darkTheme = theme.colorScheme === "dark";

  const meta_id = Object.values(metadata)[0]?.id;

  // FIXME: make memo refresh after changes to table
  const verify = useMemo(
    () =>
      Array.isArray(value) && value.length > 0
        ? metadataActions[0](value, meta_id)
        : null,
    //eslint-disable-next-line
    [metadata, value]
  );
  const boundingBox = verify && verify?.length > 1 ? verify[2] : null;
  const metaIdPosition = verify && verify?.length > 1 ? verify[3] : null;
  const expandedBoundingBox =
    boundingBox && metaIdPosition
      ? expandAABB(boundingBox, metaIdPosition?.row, metaIdPosition?.column)
      : null;

  const is_error = verify === null || verify[1].startsWith("error");

  const onCellClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: number,
    col: number
  ) => {
    if (value === undefined) return;
    const ctrl = e.ctrlKey;
    let new_data: UniversalMatrix = [
      ...value.map((val) => [
        ...val.map((val2) =>
          val2
            ? {
                ...val2,
              }
            : undefined
        ),
      ]),
    ];
    if (ctrl) {
      console.log("TODO: special action TableView");
    } else {
      if (
        new_data[row][col] !== undefined &&
        new_data[row][col]?.active !== undefined
      ) {
        new_data[row][col] = {
          ...(new_data[row][col] as CellBase<any>),
          active: undefined,
        };
      } else {
        new_data[row][col] = {
          ...(new_data[row][col] as CellBase<any>),
          active: new_data[row][col]?.value as any,
        };
      }
    }
    onSubmit?.(new_data);
  };

  return (
    <ScrollArea type="auto">
      <table
        style={{
          background: darkTheme ? "#000" : "#fff",
          padding: 0,
          margin: 0,
          borderSpacing: 0,
          border: "1px solid #333",
        }}
      >
        <tbody>
          {value?.map((row, rowIndex) => (
            <tr key={uuid + "_row_" + rowIndex}>
              {row.map((val, colIndex) => {
                const inAABB =
                  expandedBoundingBox &&
                  rowIndex >= expandedBoundingBox.minY &&
                  rowIndex <= expandedBoundingBox.maxY &&
                  colIndex >= expandedBoundingBox.minX &&
                  colIndex <= expandedBoundingBox.maxX;
                const Icon = metadataIcons?.[val?.metaPropertyId ?? -1];
                // TODO: make this use products
                const color = getColorByName(val?.value);
                return (
                  <td
                    key={uuid + "_row_" + rowIndex + "_col_" + colIndex}
                    style={{
                      // border: "1px solid #333",
                      padding: 0,
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
                      paddingRight: color !== null ? 32 : 0,
                    }}
                  >
                    {Icon && (
                      <Icon
                        // @ts-ignore
                        size={12}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          zIndex: 10,
                        }}
                      />
                    )}

                    {(inAABB &&
                      !val?.metaId &&
                      val?.value !== undefined &&
                      val?.value?.length > 0) ||
                    (!inAABB &&
                      val?.value !== undefined &&
                      val?.value?.length > 0) ? (
                      <UnstyledButton
                        sx={(theme) => ({
                          width: "100%",
                          height: "100%",
                          backgroundColor: !!val?.active
                            ? "#2F9E4488"
                            : "#E0313188",
                          color: darkTheme ? "#fff" : "#000",
                          border: "none",
                          margin: 0,
                          padding: 4,
                          gap: 0,
                          "&:hover": {
                            backgroundColor: !!val?.active
                              ? "#2F9E44"
                              : "#E03131",
                          },
                        })}
                        onClick={(
                          e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => onCellClick(e, rowIndex, colIndex)}
                      >
                        {val?.value ?? ""}
                      </UnstyledButton>
                    ) : (
                      val?.value ?? ""
                    )}

                    {color && (
                      <div
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          bottom: 2,
                          aspectRatio: "1 / 1",
                          backgroundColor: color,
                          borderRadius: "0.5em",
                        }}
                      ></div>
                    )}
                  </td>
                );
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
      {is_error && <Text color="red">{verify?.[1] ?? ""}</Text>}
    </ScrollArea>
  );
};

export default EditableTableView;
