import { ActionIcon, Group, Stack, Text, Title } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import { useId, useState } from "react"
import {
  IconCheck,
  IconColorSwatch,
  IconExternalLink,
  IconList,
  IconNotebook,
  IconRulerMeasure,
  IconTable,
  IconVector,
} from "@tabler/icons-react"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import Editable from "../../../components/editable/Editable"
import Workspace from "../../../components/layout/Workspace"
import verifyMetadata from "../../../components/spreadsheet/verifyMetadata"
import useStrapi from "../../../hooks/useStrapi"
import useStarpiUser from "../../../hooks/useStrapiUser"
import { useTranslation } from "../../../i18n"
import { OrderType } from "../../../types/OrderType"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import designBackgrounds from "../orders/designBackgrounds"
import TasksList from "./TasksList"
import template from "../../../models/order.model"

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
    IconList,
    IconNotebook,
    ...((data && data?.tables && data?.tables.map(() => IconTable)) ?? []),
    IconVector,
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
    table: {
      type: "tableView",
      metadataIcons: [IconColorSwatch, IconRulerMeasure],
      metadataLabels: ["Kolor", "Rozmiar"],
      metadata,
      metadataActions: [verifyMetadata],
      metadataActionLabels: ["Sprawdź poprawność pól"],
      metadataActionIcons: [IconCheck],
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
        <Stack style={{ position: "relative" }}>
          <ApiEntryEditable
            template={template}
            entryName={"orders"}
            id={id}
            disabled={true}
          />
          <Link href={"/erp/orders/" + data?.id} passHref>
            <ActionIcon
              size="xl"
              radius={9999}
              sx={{
                position: "fixed",
                top: "calc(var(--mantine-header-height, 0px) + 38px)",
                right: -6,
                transition: "transform 200ms ease-in-out",
                "&:hover": {
                  transform: "translate(-10px, 0)",
                },
                "&:after": {
                  content: "''",
                  position: "absolute",
                  top: 0,
                  right: -100,
                  bottom: 0,
                  width: 122,
                },
              }}
              variant="default"
            >
              <IconExternalLink />
            </ActionIcon>
          </Link>
        </Stack>
      ) : (
        <Text align="center">{t("no data")}</Text>
      )}

      {data &&
        Array.isArray(data?.tables) &&
        data.tables.map((table, index) => {
          return (
            table && (
              <div key={uuid + index}>
                <Stack style={{ minHeight: 200 }}>
                  <Title order={3}>{table.name}</Title>
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
              </div>
            )
          )
        })}
      {data &&
        Array.isArray(data?.designs) &&
        data.designs.map((design, index) => {
          return (
            design && (
              <div key={uuid + index}>
                <Stack style={{ minHeight: 200 }}>
                  <Title order={3}>{design.name}</Title>
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
              </div>
            )
          )
        })}
    </Workspace>
  )
}

export default TasksPage
