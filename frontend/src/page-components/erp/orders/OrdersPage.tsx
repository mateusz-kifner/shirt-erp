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
import {
  getQueryAsArray,
  setQuery,
  getQueryAsInt,
} from "../../../utils/nextQueryUtils"

const OrdersPage: NextPage = () => {
  const router = useRouter()
  const [sheet, setSheet] = useState<TableType>({
    name: "Arkusz 1",
    data: createEmptyMatrix(10, 10),
  })

  if (!router?.query?.show_views) {
    setQuery(router, { show_views: ["0", "1"] })
  }
  console.log(getQueryAsArray(router, "show_views"))

  const id = getQueryAsInt(router, "id")
  const currentPage = id ? 1 : 0
  return (
    <Workspace
      childrenWrapperProps={[
        undefined,
        { style: { flexGrow: 1 } },
        { style: { flexGrow: 1 } },
      ]}
      childrenLabels={["Lista zamówień", "Właściwości", "Arkusz"]}
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
