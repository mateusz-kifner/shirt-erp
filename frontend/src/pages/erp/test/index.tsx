import {
  Button,
  Group,
  Menu,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core"
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import Spreadsheet, {
  ColumnIndicatorComponent,
  CornerIndicatorComponent,
  createEmptyMatrix,
  Matrix,
  Point,
  RowIndicatorComponent,
} from "react-spreadsheet"
import { Bug, ColorSwatch, RulerMeasure } from "tabler-icons-react"
import { Cell } from "../../../components/Cell"
import ColumnIndicator, {
  enhance as enhanceColumnIndicator,
} from "../../../components/ColumnIndicator"
import CornerIndicator from "../../../components/CornerIndicator"

import TableCenterIcon from "../../../components/icons/TableCenterIcon"
import TableEdgeIcon from "../../../components/icons/TableEdgeIcon"
import RowIndicator, {
  enhance as enhanceRowIndicator,
} from "../../../components/RowIndicator"

const index = () => {
  const theme = useMantineTheme()
  const [openedColumn, setOpenedColumn] = useState<boolean>(false)
  const [openedRow, setOpenedRow] = useState<boolean>(false)
  const [contextPositionAndValue, setContextPositionAndValue] = useState<
    [number, number, number]
  >([0, 0, -1])
  const { t } = useTranslation()
  const [data, setData] = useState<Matrix<any>>(createEmptyMatrix(10, 10))
  const [selection, setSelection] = useState<Point[]>([])

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

  useEffect(() => {
    let arr: any[][] = []

    for (let y = 0; y < 10; y++) {
      arr.push([])
      for (let x = 0; x < 10; x++) {
        arr[y].push({ value: "No. " + (y * 10 + x) })
      }
    }

    setData(arr)
  }, [])

  const darkTheme = theme.colorScheme === "dark"

  const setSelectionIfNotNull = (value: Point[]) => {
    value.length != 0 && setSelection(value)
    setData((val) => val)
  }
  const applySelect = () => {
    let new_data = [
      ...data.map((val) => [
        ...val.map((val2) => ({
          ...val2,
        })),
      ]),
    ]

    for (let point of selection) {
      // console.log(point)
      new_data[point.row][point.column].style = {
        backgroundColor: "#FFDCA155",
      }
      new_data[point.row][point.column].icon = "ColorSwatch"
    }
    // console.log(new_data)
    setData(new_data)
  }

  const addColumn = (column: number) => {
    console.log("addColumn", column)
    setData((data) => [
      ...data.map((val, index) => [
        ...val.slice(0, column),
        { value: "" },
        ...val.slice(column),
      ]),
    ])
  }

  const removeRow = (row: number) =>
    setData((data) => data.filter((_, index) => row !== index))

  const addRow = (row: number) => {
    console.log("addRow", row)
    setData((data) => [
      ...data.slice(0, row),
      data[0].map(() => ({ value: "" })),
      ...data.slice(row),
    ])
  }

  const removeColumn = (column: number) =>
    setData((data) =>
      data.map((val) => val.filter((_, index) => column !== index))
    )

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
  console.log(data)
  return (
    <Stack spacing={0} style={{ height: "100%" }}>
      <Group p="xs">
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
              onClick={() => addRow(contextPositionAndValue[2])}
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
              onClick={() => addRow(contextPositionAndValue[2] + 1)}
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
              onClick={() => removeRow(contextPositionAndValue[2])}
            >
              {t("remove-row")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Button.Group>
          <Button variant="default" p={0} size="xs">
            <ColorSwatch />
          </Button>
          <Button variant="default" p={0} size="xs">
            <RulerMeasure />
          </Button>
        </Button.Group>

        <Button.Group>
          <Button variant="default" p={0} size="xs" onClick={applySelect}>
            <Bug />
          </Button>
          <Button variant="default" p={0} size="xs">
            <RulerMeasure />
          </Button>
        </Button.Group>
      </Group>

      <Spreadsheet
        data={data}
        onChange={setDataWhenNEQ}
        onSelect={setSelectionIfNotNull}
        darkMode={darkTheme}
        Cell={Cell}
        className="Spreadsheet"
        ColumnIndicator={enhancedColumnIndicator}
        RowIndicator={enhancedRowIndicator}
        CornerIndicator={CornerIndicator as unknown as CornerIndicatorComponent}
        // onCellCommit={(prevCell, nextCell, coords) => {
        //     // onSubmit && onSubmit({ data, name })
        //
        // }}
      />
    </Stack>
  )
}

export default index
