import { useId, useState } from "react"

import template from "../../../models/order.model"
import * as XLSX from "xlsx"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import Workspace from "../../../components/layout/Workspace"
import OrdersList from "./OrdersList"
import _ from "lodash"
import { useRouter } from "next/router"
import { NextPage } from "next"
import { getQueryAsIntOrNull, setQuery } from "../../../utils/nextQueryUtils"
import OrderAddModal from "./OrderAddModal"
import useStrapi from "../../../hooks/useStrapi"
import { OrderType } from "../../../types/OrderType"
import Editable from "../../../components/editable/Editable"
import {
  ColorSwatch,
  List,
  Notebook,
  RulerMeasure,
  Table,
  TrashX,
  Vector,
} from "tabler-icons-react"
import { Button, Group, Modal, Stack, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

const entryName = "orders"

const OrdersPage: NextPage = () => {
  const uuid = useId()
  const [openAddModal, setOpenAddModal] = useState<boolean>(false)

  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")
  const childrenIcons = [List, Notebook, Table]
  const { data, update } = useStrapi<OrderType>(entryName, id, {
    query: "populate=*",
  })
  const [status, setStatus] = useState<
    "loading" | "idle" | "error" | "success"
  >("idle")
  const childrenLabels = [
    "Lista zamówień",
    "Właściwości",
    ...(data && Array.isArray(data?.tables)
      ? data.tables.map((table, index) => table.name)
      : []),
  ]

  const apiUpdate = (key: string, val: any) => {
    setStatus("loading")
    update({ [key]: val } as Partial<OrderType>)
      .then((val: any) => {
        setStatus("success")
      })
      .catch((err: any) => {
        setStatus("error")
      })
  }

  const { t } = useTranslation()
  const metadata = data
    ? data.products.reduce(
        (prev, next) => ({
          ...prev,
          [next.name ?? "[NAME NOT SET] " + next.id]: { id: next.id },
        }),
        {}
      )
    : {}
  const table_template = {
    name: {
      label: "Nazwa arkusza",
      type: "text",
    },
    table: {
      type: "table",
      metadataIcons: [ColorSwatch, RulerMeasure],
      metadataLabels: ["Kolor", "Rozmiar"],
      metadata,
    },
  }

  const onAddElement = (element: number) => {
    switch (element) {
      case 0:
        data &&
          update({
            id: data.id,
            tables: [
              ...(data.tables ?? []),
              {
                name: "Arkusz " + ((data.tables?.length ?? 0) + 1),
                table: [
                  [null, null],
                  [null, null],
                ],
              },
            ],
          })

        break
      case 1:
        console.log("Design")
        break
    }
  }

  return (
    <>
      <Workspace
        childrenLabels={childrenLabels}
        childrenIcons={childrenIcons}
        addElementLabels={["sheet", "design"]}
        addElementIcons={[Table, Vector]}
        onAddElement={onAddElement}
      >
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
                <>
                  <Stack style={{ position: "relative", minHeight: 200 }}>
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
                    />{" "}
                  </Stack>
                  <Button
                    color="red"
                    variant="outline"
                    leftIcon={<TrashX size={18} />}
                    onClick={() => {} /*setOpenedDelete(true)*/}
                    mt={"4rem"}
                    className="erase_on_print"
                    style={{ width: "100%" }}
                  >
                    {t("delete", {
                      entry: t(`${"sheet"}` as any),
                    })}
                  </Button>
                  <Modal
                    opened={false}
                    onClose={() => {} /*setOpenedDelete(false)*/}
                    title={t("delete", {
                      entry: t(`${"sheet"}` as any),
                    })}
                    centered
                  >
                    <Text color="red" mb="xl">
                      {t("operation-not-reversible")}
                    </Text>
                    <Group position="apart" mt="xl">
                      <Button
                        color="red"
                        variant="outline"
                        leftIcon={<TrashX size={18} />}
                        onClick={() => {
                          // id &&
                          //   remove(id)
                          //     .then(() => router.push("."))
                          //     .catch(() => {})
                          /*setOpenedDelete(false)*/
                        }}
                      >
                        {t("delete", {
                          entry: t(`${"sheet"}` as any),
                        })}
                      </Button>
                      <Button onClick={() => {} /*setOpenedDelete(false)*/}>
                        {t("cancel")}
                      </Button>
                    </Group>
                  </Modal>
                </>
              )
            )
          })}
      </Workspace>
      <OrderAddModal
        opened={openAddModal}
        onClose={(id) => {
          setOpenAddModal(false)
          id !== undefined && router.push(`/erp/orders/${id}?pinned=0&active=1`)
        }}
      />
    </>
  )
}

export default OrdersPage
