import { useEffect, useId, useMemo, useState } from "react";

// Icons
import { IconScreenShare, IconTrashX } from "@tabler/icons-react";

// Spreadsheet Imports
import type {
  CellComponent,
  ColumnIndicatorComponent,
  RowIndicatorComponent,
  Selection,
  PointRange,
} from "react-spreadsheet";
import ReactSpreadsheet, { EmptySelection } from "react-spreadsheet";
import { type UniversalMatrix, useSpreadSheetData } from "./useSpreadSheetData";

import { getRandomColorByNumber } from "../../utils/getRandomColor";

import Button from "@/components/ui/Button";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import useTranslation from "@/hooks/useTranslation";
import type TablerIconType from "@/types/TablerIconType";
import { trpc } from "@/utils/trpc";
import TableCenterIcon from "../icons/TableCenterIcon";
import TableEdgeIcon from "../icons/TableEdgeIcon";
import { ContextMenuItem } from "../ui/ContextMenu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";
import { Cell, enhance as enhanceCell } from "./Cell";
import ColumnIndicator, {
  enhance as enhanceColumnIndicator,
} from "./ColumnIndicator";
import DataViewer from "./DataViewer";
import RowIndicator, { enhance as enhanceRowIndicator } from "./RowIndicator";

interface SpreadsheetProps {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => [UniversalMatrix, string, any, any];
  }[];
}

const Spreadsheet = (props: SpreadsheetProps) => {
  const { id, metadata, metadataActions, metadataVisuals } = props;
  const { data: value } = trpc.spreadsheet.getById.useQuery(id, {});
  const { mutateAsync: update } = trpc.spreadsheet.update.useMutation();
  const [statusText, setStatusText] = useState<string>("");
  const uuid = useId();
  const t = useTranslation();
  const [
    data,
    {
      setData,
      addColumn,
      removeColumn,
      addRow,
      removeRow,
      clearMetadata,
      setMetadata,
    },
  ] = useSpreadSheetData(
    (value?.data as UniversalMatrix) ?? [
      [{ value: "" }, { value: "" }],
      [{ value: "" }, { value: "" }],
    ],
  );

  const [selection, setSelection] = useState<PointRange | null>(null);
  const [updateCount, setUpdateCount] = useState<number>(0);
  const [canUpdate, setCanUpdate] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const incrementUpdateCount = () => setUpdateCount((count) => count + 1);

  const onApiUpdate = () => {
    const new_data = data.map((row) =>
      row.map((value) => (value === undefined ? { value: "" } : value)),
    );
    value?.id !== undefined &&
      update({ ...value, data: new_data }).catch(console.log);
  };

  const setDataWhenNEQ = (new_data: UniversalMatrix) => {
    let eq = true;
    if (
      new_data.length === data.length &&
      new_data[0]?.length === data[0]?.length
    ) {
      for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[0]?.length; x++) {
          if (
            new_data[y]?.[x]?.value !== data[y]?.[x]?.value ||
            new_data[y]?.[x]?.metaId !== data[y]?.[x]?.metaId ||
            new_data[y]?.[x]?.metaPropertyId !== data[y]?.[x]?.metaPropertyId
          ) {
            eq = false;
          }
        }
      }
    } else {
      eq = false;
    }

    if (!eq) {
      setData(new_data);
    }
  };

  const setSelectionIfNotNull = (value: Selection) => {
    const range = value.toRange(data);
    !(value instanceof EmptySelection) && setSelection(range);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setMetadataOnSelection = (metadata: { [key: string]: any }) => {
    selection !== null && setMetadata(selection, metadata);
    incrementUpdateCount();
    setSelection(null);
  };
  const clearMetadataOnSelection = () => {
    selection !== null && clearMetadata(selection);
    incrementUpdateCount();
    setSelection(null);
  };

  useEffect(() => {
    if (updateCount > 0 && canUpdate) {
      let eq = true;
      if (
        value?.data &&
        value.data.length === data.length &&
        value.data[0]?.length === data[0]?.length
      ) {
        for (let y = 0; y < data.length; y++) {
          for (let x = 0; x < data[0]?.length; x++) {
            if (
              value.data[y]?.[x]?.value !== data[y]?.[x]?.value ||
              value.data[y]?.[x]?.metaId !== data[y]?.[x]?.metaId ||
              value.data[y]?.[x]?.metaPropertyId !==
                data[y]?.[x]?.metaPropertyId
            ) {
              eq = false;
            }
          }
        }
      } else {
        eq = false;
      }

      if (!eq) {
        onApiUpdate();
        setUpdateCount(0);
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCount, canUpdate]);

  useEffect(() => {
    if (value?.data) {
      setData(value.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.data]);

  // useEffect(() => {}, [disabled]);

  const enhancedColumnIndicator = useMemo(
    () =>
      enhanceColumnIndicator(ColumnIndicator, (column: number) => (
        <>
          <ContextMenuItem
            onClick={() => {
              addColumn(column);
              incrementUpdateCount();
              setStatusText("Dodano kolumnę");
            }}
          >
            <TableEdgeIcon
              action_color={"#84cc16"}
              size={20}
              stroke={1.2}
              style={{ transform: "scale(-1)" }}
            />
            {t.add_column_left}
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() => {
              addColumn(column + 1);
              incrementUpdateCount();
              setStatusText("Dodano kolumnę");
            }}
          >
            <TableEdgeIcon action_color={"#84cc16"} size={20} stroke={1.2} />
            {t.add_column_right}
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() => {
              removeColumn(column);
              incrementUpdateCount();
              setStatusText("Usunięto kolumnę");
            }}
          >
            <TableCenterIcon action_color={"#ef4444"} size={20} stroke={1} />
            {t.remove_column}
          </ContextMenuItem>
        </>
      )) as unknown as ColumnIndicatorComponent,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const enhancedRowIndicator = useMemo(
    () =>
      enhanceRowIndicator(RowIndicator, (row) => (
        <>
          <ContextMenuItem
            onClick={() => {
              addRow(row);
              incrementUpdateCount();
              setStatusText("Dodano kolumnę");
            }}
          >
            <TableEdgeIcon
              action_color={"#84cc16"}
              size={20}
              stroke={1.2}
              style={{ transform: "rotate(-90deg)" }}
            />
            {t.add_row_top}
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() => {
              addRow(row + 1);
              incrementUpdateCount();
              setStatusText("Dodano kolumnę");
            }}
          >
            <TableEdgeIcon
              action_color={"#84cc16"}
              size={20}
              stroke={1.2}
              style={{ transform: "rotate(90deg)" }}
            />
            {t.add_row_bottom}
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() => {
              removeRow(row);
              incrementUpdateCount();
              setStatusText("Usunięto kolumnę");
            }}
          >
            <TableCenterIcon
              action_color={"#ef4444"}
              size={20}
              stroke={1}
              style={{ transform: "rotate(90deg)" }}
            />
            {t.remove_row}
          </ContextMenuItem>
        </>
      )) as unknown as RowIndicatorComponent,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const enhancedCell = useMemo(
    () =>
      enhanceCell(
        Cell,
        metadataVisuals.map((val) => val.icon) ?? [],
      ) as unknown as CellComponent,
    [metadataVisuals],
  );

  const metadataActionsMemo = useMemo(() => metadataActions, [metadataActions]);

  return (
    <div
      className={
        fullscreen
          ? "absolute top-0 right-0 left-0 z-[9999] h-[200vh] overflow-hidden bg-gray-200 dark:bg-stone-800"
          : "h-full p-px"
      }
    >
      <div
        className={`flex items-end justify-between px-2 py-2${
          ""
          // disabled ? "none" : ""
        }`}
      >
        <div className="flex flex-wrap items-end gap-2">
          {metadata &&
            Object.keys(metadata).map((key, bgIndex) => (
              <div key={`${uuid}_${bgIndex}`} className="flex flex-col">
                <div className="text-sm italic">{key.split(":")[0]}</div>
                <div>
                  {metadataVisuals?.map((visual, index) => {
                    const Icon = visual?.icon;
                    return (
                      <Tooltip key={`${uuid}_${bgIndex}_${index}`}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="relative rounded-none before:absolute before:inset-0 last:rounded-r first:rounded-l hover:before:bg-black/20"
                            style={{
                              backgroundColor: `${getRandomColorByNumber(
                                metadata[key]?.id,
                              )}88`,
                            }}
                            onClick={() => {
                              setMetadataOnSelection({
                                metaId: metadata[key]?.id,
                                metaPropertyId: index,
                              });
                              setStatusText("Ustawiono metadane");
                              incrementUpdateCount();
                            }}
                          >
                            <Icon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{visual.label}</TooltipContent>
                      </Tooltip>
                    );
                  })}

                  {metadataActions?.map((action, index) => {
                    const Icon = action?.icon;
                    return (
                      <Tooltip key={`${uuid}_${bgIndex}_action_${index}`}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="relative rounded-none border-l-0 before:absolute before:inset-0 last:rounded-r first:rounded-l first:border hover:before:bg-black/20"
                            style={{
                              backgroundColor: `${getRandomColorByNumber(
                                metadata[key]?.id,
                              )}88`,
                            }}
                            onClick={() => {
                              metadataActionsMemo[index] &&
                                setData((data) => {
                                  const [new_data, status] = action.action(
                                    data,
                                    metadata[key]?.id,
                                  );
                                  setStatusText(status);
                                  return new_data;
                                });
                            }}
                          >
                            {Icon && <Icon />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{action.label}</TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  clearMetadataOnSelection();
                  incrementUpdateCount();
                  setStatusText("Usunięto metadane");
                }}
              >
                <IconTrashX />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.clear}</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setFullscreen((fullscreen) => !fullscreen);
                }}
              >
                <IconScreenShare />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.fullscreen}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <ScrollArea className="bg-white dark:bg-stone-950">
        <ReactSpreadsheet
          data={data}
          onChange={(data) => {
            setDataWhenNEQ(data);
            incrementUpdateCount();
          }}
          onSelect={setSelectionIfNotNull}
          darkMode={document.querySelector("html")?.classList.contains("dark")}
          onModeChange={(mode) => {
            setCanUpdate(mode === "view");
          }}
          onCellCommit={() => setCanUpdate(true)}
          DataViewer={DataViewer}
          // DataEditor={disabled ? DataEditorDisabled : undefined}
          Cell={enhancedCell}
          className="Spreadsheet"
          ColumnIndicator={enhancedColumnIndicator}
          RowIndicator={enhancedRowIndicator}
        />
        <div style={{ height: 4 }} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div
        className={`p-2${
          statusText.startsWith("error")
            ? "text-red-500"
            : statusText.startsWith("success")
              ? "text-green-500"
              : "text-gray-500"
        }`}
      >
        {statusText || "⸺"}
      </div>
    </div>
  );
};

export default Spreadsheet;
