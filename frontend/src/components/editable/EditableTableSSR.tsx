import {
  Button,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
  Input,
  Divider,
  ScrollArea,
  Loader,
} from "@mantine/core"
import React, {
  ComponentType,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import Spreadsheet, {
  CellComponent,
  ColumnIndicatorComponent,
  CornerIndicatorComponent,
  Matrix,
  Point,
  RowIndicatorComponent,
} from "react-spreadsheet"
import { Trash } from "tabler-icons-react"
import ColumnIndicator, {
  enhance as enhanceColumnIndicator,
} from "../ColumnIndicator"
import CornerIndicator from "../CornerIndicator"
import TableCenterIcon from "../icons/TableCenterIcon"
import TableEdgeIcon from "../icons/TableEdgeIcon"
import RowIndicator, { enhance as enhanceRowIndicator } from "../RowIndicator"
import { Cell, enhance as enhanceCell } from "../Cell"
import colors from "../../models/colors.json"

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
  } = props
  const uuid = useId()
  const theme = useMantineTheme()
  const [openedColumn, setOpenedColumn] = useState<boolean>(false)
  const [openedRow, setOpenedRow] = useState<boolean>(false)
  const [contextPositionAndValue, setContextPositionAndValue] = useState<
    [number, number, number]
  >([0, 0, -1])
  const { t } = useTranslation()
  const [data, setData] = useState<Matrix<any>>(
    value ?? initialValue ?? [[{ value: "" }]]
  )
  const [selection, setSelection] = useState<Point[]>([])
  const [updateCount, setUpdateCount] = useState<number>(0)
  const [canUpdate, setCanUpdate] = useState<boolean>(true)
  const incrementUpdateCount = () => setUpdateCount((count) => count + 1)

  const setDataWhenNEQ = (new_data: any[][]) => {
    let eq = true
    if (
      new_data.length === data.length &&
      new_data[0].length === data[0].length
    ) {
      for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[0].length; x++) {
          if (
            new_data[y][x]?.value !== data[y][x]?.value ||
            new_data[y][x]?.productId !== data[y][x]?.productId ||
            new_data[y][x]?.property !== data[y][x]?.property
          ) {
            eq = false
          }
        }
      }
    } else {
      eq = false
    }

    if (!eq) {
      setData(new_data)
    }
  }

  const darkTheme = theme.colorScheme === "dark"

  const setSelectionIfNotNull = (value: Point[]) => {
    value.length != 0 && setSelection(value)
  }

  const setMetadata = (metadata: { [key: string]: any }) => {
    let new_data = [
      ...data.map((val) => [
        ...val.map((val2) => ({
          ...val2,
        })),
      ]),
    ]

    for (let point of selection) {
      new_data[point.row][point.column] = {
        ...new_data[point.row][point.column],
        ...metadata,
      }
    }
    setData(new_data)
    incrementUpdateCount()
    setSelection([])
  }

  const clearMetadata = () => {
    let new_data = [
      ...data.map((val) => [
        ...val.map((val2) => ({
          ...val2,
        })),
      ]),
    ]

    for (let point of selection) {
      new_data[point.row][point.column] = {
        value: new_data[point.row][point.column].value ?? "",
      }
    }
    setData(new_data)
    incrementUpdateCount()
    setSelection([])
  }

  const clearAllMetadata = () => {
    let new_data = [
      ...data.map((val) => [
        ...val.map((val2) => ({
          value: val2?.value ?? "",
        })),
      ]),
    ]

    setData(new_data)
    incrementUpdateCount()
    setSelection([])
  }

  const addColumn = (column: number) => {
    setData((data) => [
      ...data.map((val, index) => [
        ...val.slice(0, column),
        { value: "" },
        ...val.slice(column),
      ]),
    ])
    incrementUpdateCount()
  }

  const removeRow = (row: number) => {
    if (data.length > 2) {
      setData((data) => data.filter((_, index) => row !== index))
      incrementUpdateCount()
    }
  }

  const addRow = (row: number) => {
    setData((data) => [
      ...data.slice(0, row),
      data[0].map(() => ({ value: "" })),
      ...data.slice(row),
    ])
    incrementUpdateCount()
  }

  const removeColumn = (column: number) => {
    if (data[0].length > 2) {
      setData((data) =>
        data.map((val) => val.filter((_, index) => column !== index))
      )
      incrementUpdateCount()
    }
  }

  const onContextmenuColumn = (
    e: React.MouseEvent<HTMLDivElement>,
    column: number
  ) => {
    e.preventDefault()
    if (!openedColumn) {
      setOpenedColumn(true)
      setContextPositionAndValue([e?.pageX, e?.pageY, column])
    } else {
      setOpenedColumn(false)
    }
  }

  const onContextmenuRow = (
    e: React.MouseEvent<HTMLDivElement>,
    row: number
  ) => {
    e.preventDefault()
    if (!openedRow) {
      setOpenedRow(true)
      setContextPositionAndValue([e?.pageX, e?.pageY, row])
    } else {
      setOpenedRow(false)
    }
  }

  useEffect(() => {
    if (updateCount > 0 && canUpdate) {
      let eq = true
      if (
        value &&
        value.length === data.length &&
        value[0].length === data[0].length
      ) {
        for (let y = 0; y < data.length; y++) {
          for (let x = 0; x < data[0].length; x++) {
            if (
              value[y][x]?.value !== data[y][x]?.value ||
              value[y][x]?.metaId !== data[y][x]?.metaId ||
              value[y][x]?.metaActionId !== data[y][x]?.metaActionId
            ) {
              eq = false
            }
          }
        }
      } else {
        eq = false
      }

      if (!eq) {
        onSubmit && onSubmit(data)
        setUpdateCount(0)
      }
    }
  }, [updateCount, canUpdate])

  const enhancedColumnIndicator = useMemo(
    () =>
      enhanceColumnIndicator(
        ColumnIndicator,
        onContextmenuColumn
      ) as unknown as ColumnIndicatorComponent,
    [openedColumn]
  )

  const enhancedRowIndicator = useMemo(
    () =>
      enhanceRowIndicator(
        RowIndicator,
        onContextmenuRow
      ) as unknown as RowIndicatorComponent,
    [openedRow]
  )

  const enhancedCell = useMemo(
    () => enhanceCell(Cell, metadataIcons ?? []) as unknown as CellComponent,
    [metadataIcons]
  )

  return (
    <Stack spacing={0} style={{ height: "100%" }}>
      <Group p="xs" align="end">
        {/*Column Menu*/}
        <Menu
          opened={openedColumn}
          position="bottom-end"
          onChange={setOpenedColumn}
          closeOnEscape={true}
          closeOnItemClick={true}
          closeOnClickOutside={true}
          styles={{
            dropdown: {
              position: "absolute",
              top: contextPositionAndValue[1],
              left: contextPositionAndValue[0],
            },
          }}
        >
          <Menu.Dropdown onBlur={() => setOpenedColumn(false)}>
            <Menu.Item py={4}>
              <Text color="grey" size="xs">
                {t("close")}
              </Text>
            </Menu.Item>
            <Menu.Item
              icon={
                <TableEdgeIcon
                  action_color={theme.colors.green[6]}
                  size={18}
                  stroke={1.2}
                  style={{ transform: "scale(-1)" }}
                />
              }
              onClick={() => addColumn(contextPositionAndValue[2])}
            >
              {t("add-column-left")}
            </Menu.Item>
            <Menu.Item
              icon={
                <TableEdgeIcon
                  action_color={theme.colors.green[6]}
                  size={18}
                  stroke={1.2}
                />
              }
              onClick={() => addColumn(contextPositionAndValue[2] + 1)}
            >
              {t("add-column-right")}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              icon={
                <TableCenterIcon
                  action_color={theme.colors.red[6]}
                  size={18}
                  stroke={1}
                  action_position="center"
                />
              }
              onClick={() => removeColumn(contextPositionAndValue[2])}
            >
              {t("remove-column")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        {/*Row Menu*/}
        <Menu
          opened={openedRow}
          position="bottom-end"
          onChange={setOpenedRow}
          closeOnEscape={true}
          closeOnItemClick={true}
          closeOnClickOutside={true}
          styles={{
            dropdown: {
              position: "absolute",
              top: contextPositionAndValue[1],
              left: contextPositionAndValue[0],
            },
          }}
        >
          <Menu.Dropdown onBlur={() => setOpenedRow(false)}>
            <Menu.Item py={4}>
              <Text color="grey" size="xs">
                {t("close")}
              </Text>
            </Menu.Item>
            <Menu.Item
              icon={
                <TableEdgeIcon
                  action_color={theme.colors.green[6]}
                  size={18}
                  stroke={1.2}
                  style={{ transform: "rotate(-90deg)" }}
                />
              }
              component="button"
              onClick={() => {
                addRow(contextPositionAndValue[2])
                incrementUpdateCount()
              }}
            >
              {t("add-row-top")}
            </Menu.Item>
            <Menu.Item
              icon={
                <TableEdgeIcon
                  action_color={theme.colors.green[6]}
                  size={18}
                  stroke={1.2}
                  style={{ transform: "rotate(90deg)" }}
                />
              }
              onClick={() => {
                addRow(contextPositionAndValue[2] + 1)
                incrementUpdateCount()
              }}
            >
              {t("add-row-bottom")}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              icon={
                <TableCenterIcon
                  action_color={theme.colors.red[6]}
                  size={18}
                  stroke={1.2}
                  style={{ transform: "rotate(-90deg)" }}
                  action_position="center"
                />
              }
              onClick={() => {
                removeRow(contextPositionAndValue[2])
                incrementUpdateCount()
              }}
            >
              {t("remove-row")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        {metadata &&
          Object.keys(metadata).map((key, bgIndex) => (
            <div key={uuid + "_" + bgIndex}>
              <Input.Wrapper label={key}>
                <Button.Group>
                  {metadataIcons &&
                    metadataIcons.map((Icon, index) => (
                      <Tooltip
                        label={metadataLabels?.[index]}
                        m={0}
                        withinPortal
                        key={uuid + "_" + bgIndex + "_" + index}
                      >
                        <Button
                          variant="default"
                          p={0}
                          size="xs"
                          style={{
                            backgroundColor:
                              colors[metadata[key].id % 10] + "88",
                          }}
                          onClick={() => {
                            setMetadata({
                              metaId: metadata[key].id,
                              metaActionId: index,
                            })
                            incrementUpdateCount()
                          }}
                        >
                          {Icon && <Icon />}
                        </Button>
                      </Tooltip>
                    ))}
                </Button.Group>
              </Input.Wrapper>

              <Divider orientation="vertical" />
            </div>
          ))}

        <Tooltip label={t("clear") as string}>
          <Button
            variant="default"
            p={0}
            size="xs"
            onClick={() => {
              clearMetadata()
              incrementUpdateCount()
            }}
          >
            <Trash />
          </Button>
        </Tooltip>
      </Group>
      <ScrollArea>
        <Spreadsheet
          data={data}
          onChange={(data) => {
            setDataWhenNEQ(data)
            incrementUpdateCount()
          }}
          onSelect={setSelectionIfNotNull}
          darkMode={darkTheme}
          Cell={enhancedCell}
          className="Spreadsheet"
          ColumnIndicator={enhancedColumnIndicator}
          RowIndicator={enhancedRowIndicator}
          CornerIndicator={
            CornerIndicator as unknown as CornerIndicatorComponent
          }
          onModeChange={(mode) => {
            setCanUpdate(mode === "view")
          }}
          onCellCommit={() => setCanUpdate(true)}
        />
      </ScrollArea>
    </Stack>
  )
}

export default EditableTable
