import { Group, Stack, Text } from "@mantine/core"
import { useRouter } from "next/router"
import { useId, useState } from "react"
import {
  Check,
  ColorSwatch,
  List,
  Notebook,
  Robot,
  RulerMeasure,
  Table,
  Vector,
} from "tabler-icons-react"
import DeleteButton from "../../../components/DeleteButton"
import Editable from "../../../components/editable/Editable"
import { getColorNameFromHex } from "../../../components/editable/EditableColor"
import Workspace from "../../../components/layout/Workspace"
import NotImplemented from "../../../components/NotImplemented"
import { UniversalMatrix } from "../../../components/spreadsheet/useSpreadSheetData"
import verifyMetadata from "../../../components/spreadsheet/verifyMetadata"
import useStrapi from "../../../hooks/useStrapi"
import useStarpiUser from "../../../hooks/useStrapiUser"
import { useTranslation } from "../../../i18n"
import { OrderType } from "../../../types/OrderType"
import { getQueryAsIntOrNull, setQuery } from "../../../utils/nextQueryUtils"
import designBackgrounds from "../orders/designBackgrounds"
import TasksList from "./TasksList"
import TaskView from "./TaskView"

// Complex query https://youtu.be/JaM2rExmmqs?t=640
const TasksPage = () => {
  const { data: userData } = useStarpiUser()
  const router = useRouter()

  const id = getQueryAsIntOrNull(router, "id")

  const { data, update } = useStrapi<OrderType>("orders", id, {
    query: "populate=*",
    queryOptions: {
      enabled: userData !== undefined,
    },
  })
  const { t } = useTranslation()
  const uuid = useId()
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

  const design_template = {
    name: {
      label: "Nazwa designu",
      type: "text",
      disabled: true,
    },
    design: {
      type: "designView",
      files: data?.files,
      backgrounds: designBackgrounds,
    },
  }

  const metadata = data?.products
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
      disabled: true,
    },
    table: {
      type: "tableView",
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
            const product = data?.products
              ? (data?.products.filter((val) => val.id === metaId) || [null])[0]
              : null
            const sizes = product?.variants?.sizes
            const colors = product?.variants?.colors

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
  return (
    <Workspace childrenLabels={childrenLabels} childrenIcons={childrenIcons}>
      <TasksList
        onChange={(val: any) => {
          router.push("/erp/tasks/" + val.id)
        }}
      />
      {id !== null ? (
        <TaskView order={data} />
      ) : (
        <Text align="center">{t("no data")}</Text>
      )}

      {data &&
        Array.isArray(data?.tables) &&
        data.tables.map((table, index) => {
          // console.log(table)
          return (
            table && (
              <div key={uuid + index}>
                <Stack style={{ minHeight: 200 }}>
                  <Editable
                    template={table_template}
                    data={table}
                    onSubmit={(key, value) => {
                      console.log("onSubmit table [", key, "]: ", value)
                      data?.tables &&
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
                <Group></Group>
                <DeleteButton
                  label="sheet"
                  onDelete={() =>
                    data.tables &&
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
                <Stack style={{ minHeight: 200 }}>
                  <Editable
                    template={design_template}
                    data={design}
                    onSubmit={(key, value) => {
                      console.log("onSubmit design [", key, "]: ", value)
                      data.designs &&
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
                </Stack>
                <Group></Group>
                <DeleteButton
                  label="design"
                  onDelete={() =>
                    data.designs &&
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
  )
}

export default TasksPage
