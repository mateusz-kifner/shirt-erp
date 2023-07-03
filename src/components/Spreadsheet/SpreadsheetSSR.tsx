import React, { useId, useMemo, useState, type ComponentType } from "react";

// Icons
import { IconScreenShare, IconTrash } from "@tabler/icons-react";

// Spreadsheet Imports
import type {
  CellComponent,
  ColumnIndicatorComponent,
  CornerIndicatorComponent,
  Matrix,
  Point,
  RowIndicatorComponent,
} from "react-spreadsheet";
import Spreadsheet from "react-spreadsheet";
import { Cell, enhance as enhanceCell } from "./Cell";
import ColumnIndicator, {
  enhance as enhanceColumnIndicator,
} from "./ColumnIndicator";
import CornerIndicator from "./CornerIndicator";
import DataEditorDisabled from "./DataEditorDisabled";
import DataViewer from "./DataViewer";
import RowIndicator, { enhance as enhanceRowIndicator } from "./RowIndicator";
import { UniversalMatrix, useSpreadSheetData } from "./useSpreadSheetData";

import { getRandomColorByNumber } from "../../utils/getRandomColor";

import useTranslation from "@/hooks/useTranslation";
import type EditableInput from "../../types/EditableInput";
import Button from "../ui/Button";
import ScrollArea from "../ui/ScrollArea";
import Tooltip from "../ui/Tooltip";

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
  ) => [UniversalMatrix, string])[];
  metadataActionIcons: ComponentType[];
  metadataActionLabels?: string[];
}

const EditableTable = (props: EditableTableProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    metadataIcons,
    metadataLabels,
    metadata,
    metadataActions,
    metadataActionIcons,
    metadataActionLabels,
  } = props;
  const [statusText, setStatusText] = useState<string>("");
  const uuid = useId();
  const [openedColumn, setOpenedColumn] = useState<boolean>(false);
  const [openedRow, setOpenedRow] = useState<boolean>(false);
  // const [contextPositionAndValue, setContextPositionAndValue] = useState<
  //   [number, number, number]
  // >([0, 0, -1]);
  const t = useTranslation();
  // const [data, setData] = useState<Matrix<any>>()
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
    value ??
      initialValue ?? [
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

  const onContextmenuColumn = (
    e: React.MouseEvent<HTMLDivElement>,
    column: number
  ) => {
    e.preventDefault();
    if (disabled) return;
    if (!openedColumn) {
      setOpenedColumn(true);
      // setContextPositionAndValue([e?.pageX, e?.pageY, column]);
    } else {
      setOpenedColumn(false);
    }
  };

  const onContextmenuRow = (
    e: React.MouseEvent<HTMLDivElement>,
    row: number
  ) => {
    e.preventDefault();
    if (disabled) return;
    if (!openedColumn) {
      setOpenedRow(true);
      // setContextPositionAndValue([e?.pageX, e?.pageY, row]);
    } else {
      setOpenedColumn(false);
    }
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
      enhanceColumnIndicator(
        ColumnIndicator,
        onContextmenuColumn
      ) as unknown as ColumnIndicatorComponent,
    //eslint-disable-next-line
    [openedColumn]
  );

  const enhancedRowIndicator = useMemo(
    () =>
      enhanceRowIndicator(
        RowIndicator,
        onContextmenuRow
      ) as unknown as RowIndicatorComponent,
    //eslint-disable-next-line
    [openedRow]
  );

  const enhancedCell = useMemo(
    () => enhanceCell(Cell, metadataIcons ?? []) as unknown as CellComponent,
    [metadataIcons]
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
        className={`flex items-end justify-around py-1 ${
          disabled ? "none" : ""
        }`}
      >
        <div className="flex">
          {/* Column Menu
          {openedColumn && (
            <Portal>
              <Stack
                style={{
                  position: "absolute",
                  top: contextPositionAndValue[1],
                  left: contextPositionAndValue[0],
                }}
              >
                <Button.Group
                  orientation="vertical"
                  // onBlur={() => setOpenedColumn(false)}
                >
                  <Button
                    variant="default"
                    onClick={() => {
                      setOpenedColumn(false);
                    }}
                  >
                    <Text color="grey" size="xs">
                      {t("close")}
                    </Text>
                  </Button>
                  <Button
                    variant="default"
                    leftIcon={
                      <TableEdgeIcon
                        action_color={theme.colors.green[6]}
                        size={18}
                        stroke={1.2}
                        style={{ transform: "scale(-1)" }}
                      />
                    }
                    onClick={() => {
                      addColumn(contextPositionAndValue[2]);
                      incrementUpdateCount();
                      setStatusText("Dodano kolumnę");
                      setOpenedColumn(false);
                    }}
                  >
                    {t("add-column-left")}
                  </Button>
                  <Button
                    variant="default"
                    leftIcon={
                      <TableEdgeIcon
                        action_color={theme.colors.green[6]}
                        size={18}
                        stroke={1.2}
                      />
                    }
                    onClick={() => {
                      addColumn(contextPositionAndValue[2] + 1);
                      incrementUpdateCount();
                      setStatusText("Dodano kolumnę");
                      setOpenedColumn(false);
                    }}
                  >
                    {t("add-column-right")}
                  </Button>
                  <Divider />
                  <Button
                    variant="default"
                    leftIcon={
                      <TableCenterIcon
                        action_color={theme.colors.red[6]}
                        size={18}
                        stroke={1}
                        action_position="center"
                      />
                    }
                    onClick={() => {
                      removeColumn(contextPositionAndValue[2]);
                      incrementUpdateCount();
                      setStatusText("Usunięto kolumnę");
                      setOpenedColumn(false);
                    }}
                  >
                    {t("remove-column")}
                  </Button>
                </Button.Group>
              </Stack>
            </Portal>
          )}
          {/*Row Menu}
          {openedRow && (
            <Portal>
              <Stack
                style={{
                  position: "absolute",
                  top: contextPositionAndValue[1],
                  left: contextPositionAndValue[0],
                }}
              >
                <Button.Group
                  orientation="vertical"
                  // onBlur={() => setOpenedRow(false)}
                >
                  <Button
                    variant="default"
                    onClick={() => {
                      setOpenedRow(false);
                    }}
                  >
                    <Text color="grey" size="xs">
                      {t("close")}
                    </Text>
                  </Button>
                  <Button
                    variant="default"
                    leftIcon={
                      <TableEdgeIcon
                        action_color={theme.colors.green[6]}
                        size={18}
                        stroke={1.2}
                        style={{ transform: "scale(-1)" }}
                      />
                    }
                    onClick={() => {
                      addRow(contextPositionAndValue[2]);
                      incrementUpdateCount();
                      setStatusText("Dodano kolumnę");
                      setOpenedRow(false);
                    }}
                  >
                    {t("add-row-top")}
                  </Button>
                  <Button
                    variant="default"
                    leftIcon={
                      <TableEdgeIcon
                        action_color={theme.colors.green[6]}
                        size={18}
                        stroke={1.2}
                      />
                    }
                    onClick={() => {
                      addRow(contextPositionAndValue[2] + 1);
                      incrementUpdateCount();
                      setStatusText("Dodano kolumnę");
                      setOpenedRow(false);
                    }}
                  >
                    {t("add-row-bottom")}
                  </Button>
                  <Divider />
                  <Button
                    variant="default"
                    leftIcon={
                      <TableCenterIcon
                        action_color={theme.colors.red[6]}
                        size={18}
                        stroke={1}
                        action_position="center"
                      />
                    }
                    onClick={() => {
                      removeRow(contextPositionAndValue[2]);
                      incrementUpdateCount();
                      setStatusText("Usunięto kolumnę");
                      setOpenedRow(false);
                    }}
                  >
                    {t("remove-row")}
                  </Button>
                </Button.Group>
              </Stack>
            </Portal>
          )} */}

          {metadata &&
            Object.keys(metadata).map((key, bgIndex) => (
              <div key={uuid + "_" + bgIndex}>
                {metadataIcons &&
                  metadataIcons.map((Icon, index) => (
                    <Tooltip
                      tooltip={metadataLabels?.[index]}
                      key={uuid + "_" + bgIndex + "_" + index}
                      // openDelay={500}
                    >
                      <Button
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
                        {Icon && <Icon />}
                      </Button>
                    </Tooltip>
                  ))}

                {metadataActionIcons &&
                  metadataActionIcons.map((Icon, index) => (
                    <Tooltip
                      tooltip={metadataActionLabels?.[index]}
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
                              const [new_data, status] = metadataActionsMemo[
                                index
                              ]!(data, metadata[key]!.id);
                              setStatusText(status);
                              return new_data;
                            });
                        }}
                      >
                        {Icon && <Icon />}
                      </Button>
                    </Tooltip>
                  ))}
              </div>
            ))}
          <Tooltip tooltip={t.clear}>
            <Button
              onClick={() => {
                clearMetadataOnSelection();
                incrementUpdateCount();
                setStatusText("Usunięto metadane");
              }}
            >
              <IconTrash />
            </Button>
          </Tooltip>
        </div>
        <div className="flex items-end">
          <Tooltip tooltip={t.fullscreen}>
            <Button
              onClick={() => {
                setFullscreen((fullscreen) => !fullscreen);
              }}
            >
              <IconScreenShare />
            </Button>
          </Tooltip>
        </div>
      </div>
      <ScrollArea>
        <Spreadsheet
          data={data}
          onChange={(data) => {
            // setDataWhenNEQ(data);
            incrementUpdateCount();
          }}
          onSelect={setSelectionIfNotNull}
          // darkMode={darkTheme}
          onModeChange={(mode) => {
            setCanUpdate(mode === "view");
          }}
          onCellCommit={() => setCanUpdate(true)}
          DataViewer={DataViewer}
          DataEditor={disabled ? DataEditorDisabled : undefined}
          Cell={enhancedCell}
          className="Spreadsheet"
          ColumnIndicator={enhancedColumnIndicator}
          RowIndicator={enhancedRowIndicator}
          CornerIndicator={
            CornerIndicator as unknown as CornerIndicatorComponent
          }
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

export default EditableTable;
