import { useId, useState } from "react"

import template from "../../../models/order.model.json"
import * as XLSX from "xlsx"
import EditableTable from "../../../components/editable/EditableTable"
import TableType from "../../../types/TableType"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import Workspace from "../../../components/layout/Workspace"
import OrdersList from "./OrdersList"
import _ from "lodash"
import { useRouter } from "next/router"
import { createEmptyMatrix } from "react-spreadsheet"
import { NextPage } from "next"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import OrderAddModal from "./OrderAddModal"

const OrdersPage: NextPage = () => {
  const uuid = useId()
  const [openAddModal, setOpenAddModal] = useState<boolean>(false)
  const [sheets, setSheets] = useState<TableType[]>([
    {
      name: "Arkusz 1",
      data: createEmptyMatrix(2, 2),
    },
    {
      name: "Arkusz 2",
      data: createEmptyMatrix(2, 2),
    },
  ])
  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")
  const currentView = id ? [0, 1] : 0
  const childrenLabels = ["Lista zamówień", "Właściwości"].concat(
    sheets.map((val) => val.name)
  )
  return (
    <>
      <Workspace childrenLabels={childrenLabels} defaultViews={currentView}>
        <OrdersList
          selectedId={id}
          onAddElement={() => setOpenAddModal(true)}
        />

        <ApiEntryEditable template={template} entryName={"orders"} id={id} />
        {sheets.map((table_data, index) => (
          <EditableTable
            value={table_data}
            onSubmit={(data) => {
              data &&
                setSheets((val) =>
                  val.map((val, i) => (i === index ? data : val))
                )
              console.log(data)
            }}
            key={uuid + index}
          />
        ))}
      </Workspace>
      <OrderAddModal
        opened={openAddModal}
        onClose={() => setOpenAddModal(false)}
      />
    </>
  )
}

export default OrdersPage
