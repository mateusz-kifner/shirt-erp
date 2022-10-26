import React, { useState } from "react"
import { createEmptyMatrix, Matrix } from "react-spreadsheet"
import EditableTable from "../../../components/editable/EditableTable"

const index = () => {
  const [data, setData] = useState<Matrix<any> | null>(createEmptyMatrix(6, 6))
  console.log("Test index", data)

  return (
    <EditableTable
      value={data ?? [[{ value: "" }]]}
      onSubmit={(val) => setData(val)}
    />
  )
}

export default index
