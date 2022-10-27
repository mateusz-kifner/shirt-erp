import { useId, useState } from "react"

import template from "../../../models/order.model"
import * as XLSX from "xlsx"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import Workspace from "../../../components/layout/Workspace"
import OrdersList from "./OrdersList"
import _ from "lodash"
import { useRouter } from "next/router"
import { NextPage } from "next"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import OrderAddModal from "./OrderAddModal"
import useStrapi from "../../../hooks/useStrapi"
import { OrderType } from "../../../types/OrderType"
import Editable from "../../../components/editable/Editable"
import { ColorSwatch, RulerMeasure } from "tabler-icons-react"

const entryName = "orders"

const table_template = {
  name: {
    label: "Nazwa arkusza",
    type: "text",
  },
  products: {
    type: "array",
    label: "Produkty",
    arrayType: "apiEntry",
    entryName: "products",
  },
  table: {
    type: "table",
    metadataIcons: [ColorSwatch, RulerMeasure],
    metadataLabels: ["Kolor", "Rozmiar"],
    metadata: {
      Product1: {
        id: 1,
      },
      Product2: {
        id: 2,
      },
    },
  },
}

const OrdersPage: NextPage = () => {
  const uuid = useId()
  const [openAddModal, setOpenAddModal] = useState<boolean>(false)

  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")
  const currentView = id ? [0, 1] : 0
  const childrenLabels = ["Lista zamówień", "Właściwości"]
  const { data, update } = useStrapi<OrderType>(entryName, id, {
    query: "populate=*",
  })
  const [status, setStatus] = useState<
    "loading" | "idle" | "error" | "success"
  >("idle")

  const apiUpdate = (key: string, val: any) => {
    setStatus("loading")
    update({ [key]: val } as Partial<OrderType>)
      .then((val) => {
        setStatus("success")
      })
      .catch((err) => {
        setStatus("error")
      })
  }
  // console.log(data)
  return (
    <>
      <Workspace childrenLabels={childrenLabels} defaultViews={currentView}>
        <OrdersList
          selectedId={id}
          onAddElement={() => setOpenAddModal(true)}
        />

        <ApiEntryEditable template={template} entryName={"orders"} id={id} />
        {data &&
          Array.isArray(data?.tables) &&
          data.tables.map((table, index) => {
            // console.log(table)
            return (
              table && (
                <Editable
                  template={table_template}
                  data={table}
                  key={uuid + index}
                  onSubmit={(key, value) => {
                    console.log("onSubmit table [", key, "]: ", value)
                    apiUpdate(
                      "tables",
                      data.tables.map((originalVal, originalIndex) =>
                        index === originalIndex
                          ? { ...originalVal, [key]: value }
                          : originalVal
                      )
                    )
                  }}
                />
              )
            )
          })}
      </Workspace>
      <OrderAddModal
        opened={openAddModal}
        onClose={(id) => {
          setOpenAddModal(false)
          id !== undefined &&
            router.push(`/erp/orders/${id}?show_views=0&show_views=1`)
        }}
      />
    </>
  )
}

export default OrdersPage
