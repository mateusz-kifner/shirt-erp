import React, { useId, useMemo } from "react";

import { type CellBase } from "react-spreadsheet";
import {
  getColorByName,
  getRandomColorByNumber,
} from "../../utils/getRandomColor";
import isNumeric from "../../utils/isNumeric";

import { type TypeAABB2D } from "@/types/AABB";
import type TablerIconType from "@/types/TablerIconType";
import { api } from "@/utils/api";
import Button from "../ui/Button";
import { ScrollArea } from "../ui/ScrollArea";
import { type UniversalMatrix } from "./useSpreadSheetData";

function expandAABB(aabb: TypeAABB2D, row: number, col: number) {
  const new_aabb = { ...aabb };
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

interface EditableTableProps {
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: { [key: string]: { id: number; [key: string]: any } };
  metadataVisuals: {
    icon: TablerIconType;
    label: string;
  }[];
  metadataActions: {
    icon: TablerIconType;
    label: string;
    action: (
      table: UniversalMatrix,
      metaId: number,
    ) => [UniversalMatrix, string, any, any];
  }[];
}

const EditableTableView = (props: EditableTableProps) => {
  const { id, metadata, metadataVisuals, metadataActions } = props;
  const uuid = useId();

  const meta_id = Object.values(metadata)[0]?.id;
  const { data: valueData, refetch } = api.spreadsheet.getById.useQuery(id, {});
  const { mutateAsync: update } = api.spreadsheet.update.useMutation();

  const value = valueData?.data as UniversalMatrix;
  // FIXME: make memo refresh after changes to table
  const verify = useMemo(
    () =>
      Array.isArray(value) && value.length > 0 && meta_id !== undefined
        ? metadataActions[0]?.action(value, meta_id)
        : null,
    //eslint-disable-next-line
    [metadata, value],
  );
  const boundingBox = verify && verify?.length > 1 ? verify[2] : null;
  const metaIdPosition = verify && verify?.length > 1 ? verify[3] : null;
  const expandedBoundingBox =
    boundingBox && metaIdPosition
      ? expandAABB(boundingBox, metaIdPosition?.row, metaIdPosition?.column)
      : null;

  const is_error = verify === null || verify?.[1].startsWith("error");

  const onApiUpdate = (data: UniversalMatrix) => {
    valueData &&
      update({ id: valueData.id, name: valueData.name, data })
        .then((res) => refetch().catch(console.log))
        .catch(console.log);
  };

  const onCellClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: number,
    col: number,
  ) => {
    if (value === undefined) return;
    const ctrl = e.ctrlKey;
    const new_data: UniversalMatrix = [
      ...value.map((val) => [
        ...val.map((val2) =>
          val2
            ? {
                ...val2,
              }
            : undefined,
        ),
      ]),
    ];
    if (ctrl) {
      console.log("TODO: special action TableView");
    } else {
      if (
        new_data[row]![col] !== undefined &&
        new_data[row]![col]?.active !== undefined
      ) {
        new_data[row]![col] = {
          ...(new_data[row]![col] as CellBase<any>),
          active: undefined,
        };
      } else {
        new_data[row]![col] = {
          ...(new_data[row]![col] as CellBase<any>),
          active: new_data[row]![col]?.value,
        };
      }
    }
    onApiUpdate?.(new_data);
  };

  return (
    <ScrollArea type="auto">
      <div className="p-2">
        <h1>{valueData?.name}</h1>
        <table className="m-0  border-spacing-0 border border-solid border-stone-800 bg-white p-0 dark:bg-black">
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
                  const Icon =
                    metadataVisuals?.[val?.metaPropertyId ?? -1]?.icon;
                  // TODO: make this use products
                  const color = getColorByName(val?.value);
                  return (
                    <td
                      key={uuid + "_row_" + rowIndex + "_col_" + colIndex}
                      className="relative box-border overflow-hidden whitespace-nowrap break-keep p-0"
                      style={{
                        // border: "1px solid #333",
                        minWidth: "3.92em",
                        minHeight: "1.9em",
                        height: "1.9em",
                        maxHeight: "1.9em",
                        textAlign: isNumeric(val?.value) ? "right" : "left",
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
                          size={12}
                          className="absolute right-0 top-0 z-10"
                        />
                      )}

                      {(inAABB &&
                        !val?.metaId &&
                        val?.value !== undefined &&
                        val?.value?.length > 0) ||
                      (!inAABB &&
                        val?.value !== undefined &&
                        val?.value?.length > 0) ? (
                        <Button
                          className="h-full w-full rounded-none"
                          size="sm"
                          style={{
                            backgroundColor: !!val?.active
                              ? "#2F9E4488"
                              : "#E0313188",
                          }}
                          onClick={(
                            e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                          ) => onCellClick(e, rowIndex, colIndex)}
                        >
                          {val?.value ?? ""}
                        </Button>
                      ) : (
                        val?.value ?? ""
                      )}

                      {color && (
                        <div
                          className="absolute bottom-0.5 right-0.5 top-0.5 aspect-square rounded-lg"
                          style={{
                            backgroundColor: color,
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

        <div
          className={
            "p-2 " +
            (verify?.[1].startsWith("error")
              ? "text-red-500"
              : verify?.[1].startsWith("success")
                ? "text-green-500"
                : "text-gray-500")
          }
        >
          {verify?.[1] || "⸺"}
        </div>
      </div>
    </ScrollArea>
  );
};

export default EditableTableView;
