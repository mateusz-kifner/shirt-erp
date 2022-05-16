import { useMantineTheme } from "@mantine/core"
import { useEffect, useState } from "react"
import Spreadsheet, {
  CellComponentProps,
  createEmptyMatrix,
  Matrix,
} from "react-spreadsheet"
import DataViewer from "./DataViewer"
import { Cell } from "./Cell"
const TestTable = () => {
  const theme = useMantineTheme()
  const [data, setData] = useState<Matrix<any>>([
    [
      { value: "test", readOnly: true, style: { backgroundColor: "#f00" } },
      { value: "test", readOnly: true },
      { value: "test", readOnly: true },
    ],
    [{ value: "test", readOnly: true }, { value: "test" }, { value: "test" }],
    [{ value: "test", readOnly: true }, { value: "test" }, { value: "test" }],
  ])

  const setDataWithReadOnly = (data: Matrix<any>) => {
    setData((prevData) =>
      prevData.map((prevRow, rowIndex) =>
        prevRow.map((prevCell, colIndex) =>
          prevCell?.readOnly == true ? prevCell : data[rowIndex][colIndex]
        )
      )
    )
  }

  return (
    <Spreadsheet
      data={data}
      onChange={setDataWithReadOnly}
      darkMode={theme.colorScheme === "dark"}
      // columnLabels={["test1", "TEST2<"]}
      // onSelect={(selected) => console.log(selected)}
      onCellCommit={(prevCell, nextCell, coords) =>
        console.log(prevCell, nextCell, coords)
      }
      DataViewer={DataViewer}
      Cell={CellWrapper}
      DataEditor={undefined}
      formulaParser={(val: any) => val}
    />
  )
}

const CellWrapper = (props: CellComponentProps) => {
  // console.log(props)
  return <Cell {...props} />
}

export default TestTable
