import { useState } from "react"

import template from "../../../models/order.model.json"
import CalcTable from "../../../components/CalcTable"
import * as XLSX from "xlsx"
import EditableTable from "../../../components/editable/EditableTable"
import TableType from "../../../types/TableType"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import Workspace from "../../../components/layout/Workspace"
import OrdersList from "./OrdersList"
import _ from "lodash"
import { useRouter } from "next/router"
import { createEmptyMatrix, Matrix } from "react-spreadsheet"
import { NextPage } from "next"

const OrdersPage: NextPage = (props) => {
  console.log(props)
  const router = useRouter()
  const [sheet, setSheet] = useState<TableType>({
    name: "Arkusz 1",
    data: createEmptyMatrix(10, 10),
  })

  const id =
    typeof router?.query?.id === "string" ? parseInt(router.query.id) : null
  console.log(router.query)
  const currentPage = id ? 1 : 0
  return (
    <Workspace
      childrenWrapperProps={[undefined, { style: { flexGrow: 1 } }]}
      childrenLabels={["Lista zamówień", "Właściwości"]}
      currentPages={currentPage}
    >
      <OrdersList selectedId={id} />

      <ApiEntryEditable template={template} entryName={"orders"} id={1} />

      <EditableTable
        value={sheet}
        onSubmit={(data) => {
          data && setSheet(data)
          console.log(data)
        }}
      />
    </Workspace>
  )
}

export default OrdersPage
