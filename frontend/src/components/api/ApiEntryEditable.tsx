import { Stack, LoadingOverlay, ThemeIcon, Loader } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useRouter } from "next/router"
import { FC, useState } from "react"
import { Check, X } from "tabler-icons-react"
import useStrapi from "../../hooks/useStrapi"
import names from "../../models/names.json"
import Editable from "../editable/Editable"

interface ApiEntryEditableProps<EntryType = any> {
  template: any
  entryName: string
  id: number | null
}

const ApiEntryEditable = <EntryType extends any>({
  template,
  entryName,
  id,
}: ApiEntryEditableProps<EntryType>) => {
  const { data, update } = useStrapi<EntryType>(entryName, id, {
    query: "populate=*",
  })
  const [status, setStatus] = useState<
    "loading" | "idle" | "error" | "success"
  >("idle")

  const router = useRouter()
  const params = router.query

  const entryNameData: any =
    //@ts-ignore
    entryName in names ? names[entryName] : { singular: "", plural: "" }

  // useDocumentTitle(
  //   params.id
  //     ? "ShirtERP - " +
  //         entryNameData.singular +
  //         " " +
  //         data?.firstname +
  //         " " +
  //         data?.lastname
  //     : "ShirtERP - " + entryNameData.plural
  // )

  const apiUpdate = (key: string, val: any) => {
    setStatus("loading")
    update({ [key]: val } as Partial<EntryType>)
      .then((val) => {
        setStatus("success")
      })
      .catch((err) => {
        setStatus("error")
      })
  }

  return (
    <Stack style={{ position: "relative", minHeight: 200 }}>
      {
        <ThemeIcon
          radius="xl"
          size="xs"
          style={{
            position: "fixed",
            top: "calc(var(--mantine-header-height, 0px) + 4px)",
            right: 4,
          }}
          color={
            status === "success"
              ? "green"
              : status === "error"
              ? "red"
              : "#00000000"
          }
        >
          {status === "success" && <Check size={12} />}
          {status === "error" && <X size={12} />}
          {status === "loading" && <Loader />}
        </ThemeIcon>
      }
      {data && (
        <Editable template={template} data={data as any} onSubmit={apiUpdate} />
      )}
      {/* <LoadingOverlay visible={status === "loading"} radius="xl" /> */}
    </Stack>
  )
}

export default ApiEntryEditable
