import { useId, useState } from "react"

import template from "../../../models/order.model"
import * as XLSX from "xlsx"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import Workspace from "../../../components/layout/Workspace"
import OrdersList from "./OrdersArchiveList"
import { NextPage } from "next"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import useStrapi from "../../../hooks/useStrapi"
import { OrderType } from "../../../types/OrderType"
import Editable from "../../../components/editable/Editable"
import {
  Check,
  ColorSwatch,
  List,
  Notebook,
  Plus,
  Robot,
  RulerMeasure,
  Table,
  Vector,
} from "tabler-icons-react"
import { Group, Menu, Text } from "@mantine/core"
import DeleteButton from "../../../components/DeleteButton"
import { useTranslation } from "../../../i18n"
import { UniversalMatrix } from "../../../components/spreadsheet/useSpreadSheetData"
import { getColorNameFromHex } from "../../../components/editable/EditableColor"
import verifyMetadata from "../../../components/spreadsheet/verifyMetadata"
import designBackgrounds from "../orders/designBackgrounds"
import { useRouter } from "next/router"
import { Tab } from "../../../components/layout/MultiTabs"
import { useMediaQuery } from "@mantine/hooks"

const entryName = "order-archives"

const OrdersPage: NextPage = () => {
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)"
  )
  const uuid = useId()

  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")
  const { data, update } = useStrapi<OrderType>(entryName, id, {
    query: "populate=*",
  })
  const [status, setStatus] = useState<
    "loading" | "idle" | "error" | "success"
  >("idle")
  const childrenIcons = [
    List,
    Notebook,
    ...((data && data?.tables && data?.tables.map(() => Table)) ?? []),
    Vector,
  ]

  const childrenLabels = id
    ? [
        "Lista zamówień",
        "Właściwości",
        ...(data && Array.isArray(data?.tables)
          ? data.tables.map((table, index) => table.name)
          : []),
        ...(data && Array.isArray(data?.designs)
          ? data.designs.map((design, index) => design.name)
          : []),
      ]
    : ["Lista zamówień"]

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
  const metadata =
    data && data?.products
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
      metadataActions: [
        (table: UniversalMatrix, metaId: number) => {
          let pusta = true
          table: for (let y = 0; y < table.length; y++) {
            for (let x = 0; x < table[0].length; x++) {
              if (!(!table[y][x] || (table[y][x] && !table[y][x]?.value))) {
                pusta = false
                break table
              }
            }
          }

          if (pusta) {
            let new_table: UniversalMatrix = []
            const product = (data?.products.filter(
              (val) => val.id === metaId
            ) || [null])[0]
            const sizes = product?.variants?.sizes
            const colors = product?.variants?.colors

            if (
              sizes === undefined ||
              sizes.length === 0 ||
              colors === undefined ||
              colors.length == 0
            )
              return [
                table,
                "error: Produkt musi mieć rozmiary i kolory do operacji auto uzupełniania.",
              ]
            for (let y = 0; y < colors.length + 1; y++) {
              new_table.push([])
              for (let x = 0; x < sizes.length + 1; x++) {
                if (y > 0 && x == 0) {
                  new_table[y].push({
                    value: getColorNameFromHex(colors[y - 1]),
                    metaId,
                    metaPropertyId: 0,
                  })
                } else if (y == 0 && x > 0) {
                  new_table[y].push({
                    value: sizes[x - 1],
                    metaId,
                    metaPropertyId: 1,
                  })
                } else {
                  new_table[y].push({ value: "" })
                }
              }
            }

            new_table = [
              new_table[0].map((val, index) =>
                index === 0 ? { value: product?.name } : undefined
              ),

              ...new_table,
            ]

            return [new_table, "Auto uzupełnienie się powiodło."]
          }
          return [
            table,
            "error: Tablica musi być pusta do operacji auto uzupełniania.",
          ]
        },
        verifyMetadata,
      ],
      metadataActionLabels: ["Auto uzupełnij", "Sprawdź poprawność pól"],
      metadataActionIcons: [Robot, Check],
    },
  }

  const design_template = {
    name: {
      label: "Nazwa designu",
      type: "text",
    },
    design: {
      type: "design",
      files: data?.files,
      backgrounds: designBackgrounds,
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
        data &&
          update({
            id: data.id,
            designs: [
              ...(data.designs ?? []),
              {
                name: "Design " + ((data.designs?.length ?? 0) + 1),
                design: {},
              },
            ],
          })
        break
    }
  }

  const addElementLabels = ["sheet", "design"]
  const addElementIcons = [Table, Vector]

  return (
    <>
      <Workspace
        childrenLabels={childrenLabels}
        childrenIcons={childrenIcons}
        rightMenuSection={
          id !== null && (
            <Menu position="bottom" withArrow withinPortal>
              <Menu.Target>
                <Tab
                  Icon={Plus}
                  value={childrenLabels.length}
                  p="xs"
                  variant="outline"
                >
                  {isMobile ? t("add") : ""}
                </Tab>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item py={4}>
                  <Text color="grey" size="xs">
                    {t("close")}
                  </Text>
                </Menu.Item>
                {addElementLabels.map((label, index) => {
                  const Icon = addElementIcons?.[index]
                    ? addElementIcons[index]
                    : Plus
                  return (
                    <Menu.Item
                      key={uuid + "_menu_" + index}
                      icon={<Icon size={18} />}
                      onClick={() => onAddElement?.(index)}
                    >
                      {t(label as any)}
                    </Menu.Item>
                  )
                })}
              </Menu.Dropdown>
            </Menu>
          )
        }
      >
        <OrdersList selectedId={id} />

        <ApiEntryEditable
          template={template}
          entryName={entryName}
          id={id}
          allowDelete
        />
        {data &&
          Array.isArray(data?.tables) &&
          data.tables.map((table, index) => {
            // console.log(table)
            return (
              table && (
                <div key={uuid + index}>
                  <div className="flex flex-col gap-3 min-h-[200px]">
                    <Editable
                      template={table_template}
                      data={table}
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
                  </div>
                  <Group></Group>
                  <DeleteButton
                    label="sheet"
                    onDelete={() =>
                      update({
                        id: data.id,
                        tables: data.tables.filter((val, i) => i !== index),
                      })
                    }
                    buttonProps={{ mt: "4rem" }}
                  />
                </div>
              )
            )
          })}
        {data &&
          Array.isArray(data?.designs) &&
          data.designs.map((design, index) => {
            // console.log(table)
            return (
              design && (
                <div key={uuid + index}>
                  <div className="flex flex-col gap-3 min-h-[200px]">
                    <Editable
                      template={design_template}
                      data={design}
                      onSubmit={(key, value) => {
                        console.log("onSubmit design [", key, "]: ", value)
                        apiUpdate(
                          "design",
                          data.designs.map((originalVal, originalIndex) =>
                            index === originalIndex
                              ? { ...originalVal, [key]: value }
                              : originalVal
                          )
                        )
                      }}
                    />{" "}
                  </div>
                  <Group></Group>
                  <DeleteButton
                    label="design"
                    onDelete={() =>
                      update({
                        id: data.id,
                        designs: data.designs.filter((val, i) => i !== index),
                      })
                    }
                    buttonProps={{ mt: "4rem" }}
                  />
                </div>
              )
            )
          })}
      </Workspace>
    </>
  )
}

export default OrdersPage
