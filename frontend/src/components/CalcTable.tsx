import { Button, useMantineTheme, Stack, Group } from "@mantine/core"
import { FC, useReducer, useState } from "react"
import Spreadsheet, { Matrix } from "react-spreadsheet"
import { Plus } from "tabler-icons-react"

const initialState: Array<Array<any>> = [[{ value: "" }]]

type Action = { type: "addHorizontal" } | { type: "addVertical" }

function reducer(state: Array<Array<any>>, action: Action): Array<Array<any>> {
  switch (action.type) {
    case "addHorizontal":
      return [...state, state[0].map(() => ({ value: "" }))]
    case "addVertical":
      return state.map((arr) => [...arr, { value: "" }])
    default:
      throw new Error()
  }
}

interface CalcTableProps {}

const CalcTable = (props: CalcTableProps) => {
  const [data, setData] = useState<Matrix<any>>([
    [
      { value: "test" },
      { value: "test", className: "test test2" },
      { value: "test" },
    ],
    [{ value: "test" }, { value: "test" }, { value: "test" }],
    [{ value: "test" }, { value: "test" }, { value: "test" }],
  ])

  const [state, dispatch] = useReducer(reducer, initialState)
  const theme = useMantineTheme()
  console.log(state)

  return (
    <Group spacing={0} align="stretch" noWrap>
      <Stack spacing={0}>
        <Spreadsheet
          data={state}
          // onChange={setData}
          onCellCommit={(prevCell, nextCell, coords) => {
            console.log(prevCell, nextCell, coords)
          }}
          darkMode={theme.colorScheme === "dark"}
        ></Spreadsheet>

        <Button
          style={{
            width: "100%",
            height: 32,
            padding: 0,
          }}
          radius={0}
          variant="outline"
          color={theme.colorScheme === "dark" ? "dark" : "gray"}
          onClick={() => dispatch({ type: "addHorizontal" })}
        >
          <Plus />
        </Button>
      </Stack>
      <Button
        style={{
          width: 32,
          height: "unset",
          display: "block",
          padding: 0,

          marginBottom: 32,
        }}
        radius={0}
        variant="outline"
        color={theme.colorScheme === "dark" ? "dark" : "gray"}
        onClick={() => dispatch({ type: "addVertical" })}
      >
        <Plus />
      </Button>
    </Group>
  )
}

export default CalcTable
