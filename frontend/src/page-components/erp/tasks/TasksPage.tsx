import { ActionIcon, Group, Text, Title } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import { useId, useState } from "react"
import {
  Check,
  ColorSwatch,
  ExternalLink,
  List,
  Notebook,
  Robot,
  RulerMeasure,
  Table,
  Vector,
} from "tabler-icons-react"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
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

const template = {
  status: {
    label: "Status",
    type: "enum",
    initialValue: "planned",
    enum_data: [
      "planned",
      "accepted",
      "in production",
      "wrapped",
      "sent",
      "rejected",
      "archived",
    ],
  },
  notes: {
    label: "Notatki",
    type: "richtext",
    initialValue: "",
  },
  price: {
    label: "Cena",
    type: "money",
    initialValue: 0,
    disabled: true,
  },
  isPricePaid: {
    label: "Cena zapłacona",
    type: "boolean",
    initialValue: false,
    children: { checked: "Tak", unchecked: "Nie" },
    disabled: true,
  },
  dateOfCompletion: {
    label: "Data ukończenia",
    type: "date",
    disabled: true,
  },
  secretNotes: {
    label: "Sekretne notatki",
    type: "secrettext",
    initialValue: "",
  },
  files: {
    label: "Pliki",
    type: "files",
    initialValue: [],
    disabled: true,
  },
  client: {
    label: "Klient",
    type: "apiEntry",
    entryName: "clients",
    linkEntry: true,
    disabled: true,
  },
  address: {
    label: {
      streetName: "Ulica",
      streetNumber: "Nr. bloku",
      apartmentNumber: "Nr. mieszkania",
      city: "Miasto",
      province: "Województwo",
      postCode: "Kod pocztowy",
      name: "Adres",
    },
    type: "address",
    initialValue: {
      streetName: "",
      streetNumber: "",
      apartmentNumber: "",
      city: "",
      province: "pomorskie",
      postCode: "",
    },
    disabled: true,
  },
  products: {
    label: "Produkty",
    type: "array",
    arrayType: "apiEntry",
    entryName: "products",
    // organizingHandle: "arrows",
    linkEntry: true,
    disabled: true,
  },
}

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
      metadataIcons: [ColorSwatch, RulerMeasure],
      metadataLabels: ["Kolor", "Rozmiar"],
      metadata,
      metadataActions: [verifyMetadata],
      metadataActionLabels: ["Sprawdź poprawność pól"],
      metadataActionIcons: [Check],
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
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-3 justify-between">
            <Title order={3}>{data?.name}</Title>
            <Link href={"/erp/orders/" + data?.id} passHref>
              <ActionIcon size="lg" radius="xl">
                <ExternalLink />
              </ActionIcon>
            </Link>
          </div>
          <ApiEntryEditable template={template} entryName={"orders"} id={id} />
        </div>
      ) : (
        <Text align="center">{t("no data")}</Text>
      )}

      {data &&
        Array.isArray(data?.tables) &&
        data.tables.map((table, index) => {
          return (
            table && (
              <div key={uuid + index}>
                <div className="flex flex-col gap-3 min-h-[200px]">
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
                </div>
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
                <div className="flex flex-col gap-3 min-h-[200px]">
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
                </div>
              </div>
            )
          )
        })}
    </Workspace>
  )
}

export default TasksPage
