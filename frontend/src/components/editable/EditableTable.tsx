import { ActionIcon, Group, Stack, useMantineTheme } from "@mantine/core"
import { debounce } from "lodash"
import { FC, useEffect, useState } from "react"
import Spreadsheet, { Matrix, Point } from "react-spreadsheet"
import TableType from "../../types/TableType"
import isArrayEqual from "../../utils/isArrayEqual"
import TableCenterIcon from "../icons/TableCenterIcon"
import TableEdgeIcon from "../icons/TableEdgeIcon"
import EditableText from "./EditableText"

//fixme: make selections visible

interface EditableTableProps {
  label?: string
  value?: TableType
  initialValue?: TableType
  onSubmit?: (value: TableType | null) => void
  disabled?: boolean
  required?: boolean
}

const EditableTable: FC<EditableTableProps> = (props) => {
  const { label, value, initialValue, onSubmit, disabled, required } = props
  const theme = useMantineTheme()
  const [name, setName] = useState(
    value?.name ?? initialValue?.name ?? "Arkusz"
  )
  const [data, setData] = useState<Matrix<any>>(
    value?.data ?? initialValue?.data ?? [[{ value: null }]]
  )
  const [selected, setSelected] = useState<Point[]>([])
  const [prevSelected, setPrevSelected] = useState<Point[]>([])

  const addColumn = (before: boolean = false) => {
    let column = data[0].length - 1
    if (selected.length > 0) {
      column = before
        ? selected
            .map((point) => point.column)
            .reduce((a, b) => Math.min(a, b), Infinity)
        : selected
            .map((point) => point.column)
            .reduce((a, b) => Math.max(a, b), -Infinity)
    }
    setData((state) =>
      state.map((row) =>
        row.flatMap((col, index) =>
          index == column
            ? before
              ? [{ value: null }, { ...col }]
              : [{ ...col }, { value: null }]
            : { ...col }
        )
      )
    )
  }

  const addRow = (before: boolean = false) => {
    let row = data[0].length - 1
    if (selected.length > 0) {
      row = before
        ? selected
            .map((point) => point.row)
            .reduce((a, b) => Math.min(a, b), Infinity)
        : selected
            .map((point) => point.row)
            .reduce((a, b) => Math.max(a, b), -Infinity)
    }
    setData((state) =>
      state.flatMap((val, index) =>
        index == row
          ? before
            ? [
                val.map((col) => ({ value: null })),
                val.map((col) => ({ ...col })),
              ]
            : [
                val.map((col) => ({ ...col })),
                val.map((col) => ({ value: null })),
              ]
          : [val.map((col) => ({ ...col }))]
      )
    )
  }

  const removeColumn = () => {
    let columns = [data[0].length - 1]
    if (selected.length > 0) {
      columns = selected.map((point) => point.column)
    }
    setData((state) =>
      state.map((row) => row.filter((val, index) => !columns.includes(index)))
    )
  }

  const removeRow = () => {
    let rows = [data[0].length - 1]
    if (selected.length > 0) {
      rows = selected.map((point) => point.row)
    }

    setData((state) => state.filter((val, index) => !rows.includes(index)))
  }

  // useEffect(() => {
  //   if (!isArrayEqual(selected, prevSelected)) {
  //     console.log(selected, prevSelected)
  //     setLock(true)
  //     setData((state) => {
  //       let new_state = state.map((row) => row.map((val) => ({ ...val })))
  //       prevSelected.map((point) => {
  //         new_state[point.row][point.column] = {
  //           ...new_state[point.row][point.column],
  //           className: "",
  //         }
  //       })
  //       selected.map((point) => {
  //         new_state[point.row][point.column] = {
  //           ...new_state[point.row][point.column],
  //           className: "Spreadsheet__cell_selected",
  //         }
  //       })
  //       return new_state
  //     })
  //   }

  // }, [selected])

  return (
    <Stack>
      <EditableText
        value={name}
        onSubmit={(new_name) => new_name && setName(new_name)}
      />

      <Group>
        <Group spacing={4}>
          <ActionIcon variant="light" size="xl" onClick={() => addRow(true)}>
            <TableEdgeIcon
              action_color={theme.colors.green[6]}
              size={48}
              stroke={1.2}
              style={{ transform: "rotate(-90deg)" }}
            />
          </ActionIcon>
          <ActionIcon variant="light" size="xl" onClick={() => addRow()}>
            <TableEdgeIcon
              action_color={theme.colors.green[6]}
              size={48}
              stroke={1.2}
              style={{ transform: "rotate(90deg)" }}
            />
          </ActionIcon>
          <ActionIcon variant="light" size="xl" onClick={() => addColumn(true)}>
            <TableEdgeIcon
              action_color={theme.colors.green[6]}
              size={48}
              stroke={1.2}
              style={{ transform: "scale(-1)" }}
            />
          </ActionIcon>
          <ActionIcon variant="light" size="xl" onClick={() => addColumn()}>
            <TableEdgeIcon
              action_color={theme.colors.green[6]}
              size={48}
              stroke={1.2}
            />
          </ActionIcon>
        </Group>
        <Group spacing={4}>
          <ActionIcon variant="light" size="xl" onClick={() => removeRow()}>
            <TableCenterIcon
              action_color={theme.colors.red[6]}
              size={48}
              stroke={1.2}
              style={{ transform: "rotate(-90deg)" }}
              action_position="center"
            />
          </ActionIcon>
          <ActionIcon variant="light" size="xl" onClick={() => removeColumn()}>
            <TableCenterIcon
              action_color={theme.colors.red[6]}
              size={42}
              stroke={1}
              action_position="center"
            />
          </ActionIcon>
        </Group>
      </Group>
      <Spreadsheet
        data={data}
        onChange={setData}
        onCellCommit={(prevCell, nextCell, coords) => {
          onSubmit && onSubmit({ data, name })
        }}
        onSelect={(new_selected) =>
          new_selected.length > 0 && setSelected(new_selected)
        }
        darkMode={theme.colorScheme === "dark"}
      ></Spreadsheet>
    </Stack>
  )
}

export default EditableTable
