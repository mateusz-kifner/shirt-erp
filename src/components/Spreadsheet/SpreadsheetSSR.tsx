import { useId, useMemo, useState } from "react";

// Icons
import { IconScreenShare, IconTrashX } from "@tabler/icons-react";

// Spreadsheet Imports
import type {
  CellComponent,
  ColumnIndicatorComponent,
  Point,
  RowIndicatorComponent,
} from "react-spreadsheet";
import ReactSpreadsheet from "react-spreadsheet";
import { UniversalMatrix, useSpreadSheetData } from "./useSpreadSheetData";

import { getRandomColorByNumber } from "../../utils/getRandomColor";

import Button from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import SimpleTooltip from "@/components/ui/SimpleTooltip";
import useTranslation from "@/hooks/useTranslation";
import TablerIconType from "@/schema/TablerIconType";
import { api } from "@/utils/api";
import TableCenterIcon from "../icons/TableCenterIcon";
import TableEdgeIcon from "../icons/TableEdgeIcon";
import { ContextMenuItem } from "../ui/ContextMenu";
import { Cell, enhance as enhanceCell } from "./Cell";
import ColumnIndicator, {
  enhance as enhanceColumnIndicator,
} from "./ColumnIndicator";
import DataViewer from "./DataViewer";
import RowIndicator, { enhance as enhanceRowIndicator } from "./RowIndicator";

interface SpreadsheetProps {
  id: number;
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
      metaId: number
    ) => [UniversalMatrix, string, any, any];
  }[];
}

const Spreadsheet = (props: SpreadsheetProps) => {
  const { id, metadata, metadataActions, metadataVisuals } = props;
  const { data: value } = api.spreadsheet.getById.useQuery(id, {});
  const [statusText, setStatusText] = useState<string>("");
  const uuid = useId();
  const t = useTranslation();
  console.log(metadata);

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
      [undefined, undefined],
      [undefined, undefined],
    ]
  );

  const [selection, setSelection] = useState<Point[]>([]);
  const [updateCount, setUpdateCount] = useState<number>(0);
  const [canUpdate, setCanUpdate] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const incrementUpdateCount = () => setUpdateCount((count) => count + 1);

  // const setDataWhenNEQ = (new_data: UniversalMatrix) => {
  //   let eq = true;
  //   if (
  //     new_data.length === data.length &&
  //     new_data[0].length === data[0].length
  //   ) {
  //     for (let y = 0; y < data.length; y++) {
  //       for (let x = 0; x < data[0].length; x++) {
  //         if (
  //           new_data[y][x]?.value !== data[y][x]?.value ||
  //           new_data[y][x]?.metaId !== data[y][x]?.metaId ||
  //           new_data[y][x]?.metaPropertyId !== data[y][x]?.metaPropertyId
  //         ) {
  //           eq = false;
  //         }
  //       }
  //     }
  //   } else {
  //     eq = false;
  //   }

  //   if (!eq) {
  //     setData(new_data);
  //   }
  // };

  const setSelectionIfNotNull = (value: Point[]) => {
    value.length != 0 && setSelection(value);
  };

  const setMetadataOnSelection = (metadata: { [key: string]: any }) => {
    setMetadata(selection, metadata);
    incrementUpdateCount();
    setSelection([]);
  };
  const clearMetadataOnSelection = () => {
    clearMetadata(selection);
    incrementUpdateCount();
    setSelection([]);
  };

  // useEffect(() => {
  //   if (updateCount > 0 && canUpdate) {
  //     let eq = true;
  //     if (
  //       value &&
  //       value.length === data.length &&
  //       value[0].length === data[0].length
  //     ) {
  //       for (let y = 0; y < data.length; y++) {
  //         for (let x = 0; x < data[0].length; x++) {
  //           if (
  //             value[y][x]?.value !== data[y][x]?.value ||
  //             value[y][x]?.metaId !== data[y][x]?.metaId ||
  //             value[y][x]?.metaPropertyId !== data[y][x]?.metaPropertyId
  //           ) {
  //             eq = false;
  //           }
  //         }
  //       }
  //     } else {
  //       eq = false;
  //     }

  //     if (!eq) {
  //       onSubmit && onSubmit(data);
  //       setUpdateCount(0);
  //     }
  //   }
  //   //eslint-disable-next-line
  // }, [updateCount, canUpdate]);

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
    []
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
    []
  );

  const enhancedCell = useMemo(
    () =>
      enhanceCell(
        Cell,
        metadataVisuals.map((val) => val.icon) ?? []
      ) as unknown as CellComponent,
    [metadataVisuals]
  );

  const metadataActionsMemo = useMemo(() => metadataActions, [metadataActions]);

  return (
    <div
      className={
        fullscreen
          ? "absolute left-0 right-0 top-0 z-[9999] h-[200vh] overflow-hidden"
          : "h-full"
      }
    >
      <div
        className={`flex items-end justify-between py-1 ${
          ""
          // disabled ? "none" : ""
        }`}
      >
        <div className="flex">
          {metadata &&
            Object.keys(metadata).map((key, bgIndex) => (
              <div key={uuid + "_" + bgIndex}>
                {metadataVisuals &&
                  metadataVisuals.map((visual, index) => {
                    const Icon = visual?.icon;
                    return (
                      <SimpleTooltip
                        tooltip={visual.label}
                        key={uuid + "_" + bgIndex + "_" + index}
                        // openDelay={500}
                      >
                        <Button
                          variant="ghost"
                          style={{
                            backgroundColor:
                              getRandomColorByNumber(metadata[key]!.id) + "88",
                          }}
                          onClick={() => {
                            setMetadataOnSelection({
                              metaId: metadata[key]!.id,
                              metaPropertyId: index,
                            });
                            setStatusText("Ustawiono metadane");
                            incrementUpdateCount();
                          }}
                        >
                          <Icon />
                        </Button>
                      </SimpleTooltip>
                    );
                  })}

                {metadataActions &&
                  metadataActions.map((action, index) => {
                    const Icon = action?.icon;
                    return (
                      <SimpleTooltip
                        tooltip={action.label}
                        key={uuid + "_" + bgIndex + "_action_" + index}
                        // openDelay={500}
                      >
                        <Button
                          style={{
                            backgroundColor:
                              getRandomColorByNumber(metadata[key]!.id) + "88",
                          }}
                          onClick={() => {
                            metadataActionsMemo[index] &&
                              setData((data) => {
                                const [new_data, status] = action.action(
                                  data,
                                  metadata[key]!.id
                                );
                                setStatusText(status);
                                return new_data;
                              });
                          }}
                        >
                          {Icon && <Icon />}
                        </Button>
                      </SimpleTooltip>
                    );
                  })}
              </div>
            ))}
          <SimpleTooltip tooltip={t.clear}>
            <Button
              onClick={() => {
                clearMetadataOnSelection();
                incrementUpdateCount();
                setStatusText("Usunięto metadane");
              }}
            >
              <IconTrashX />
            </Button>
          </SimpleTooltip>
        </div>
        <div className="flex items-end">
          <SimpleTooltip tooltip={t.fullscreen}>
            <Button
              onClick={() => {
                setFullscreen((fullscreen) => !fullscreen);
              }}
            >
              <IconScreenShare />
            </Button>
          </SimpleTooltip>
        </div>
      </div>
      <ScrollArea>
        <ReactSpreadsheet
          data={data}
          onChange={(data) => {
            // setDataWhenNEQ(data);
            incrementUpdateCount();
          }}
          onSelect={setSelectionIfNotNull}
          darkMode={document.querySelector("html")!.classList.contains("dark")}
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
        <div style={{ height: 4 }}></div>
      </ScrollArea>
      <div
        className={
          statusText.startsWith("error")
            ? "text-red-500"
            : statusText.startsWith("success")
            ? "text-green-500"
            : "text-gray-500"
        }
      >
        {statusText || "⸺"}
      </div>
    </div>
  );
};

export default Spreadsheet;
