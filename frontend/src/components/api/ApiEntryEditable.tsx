import { Stack } from "@mantine/core"
import { useRouter } from "next/router"
import { useState } from "react"
import useStrapi from "../../hooks/useStrapi"
import names from "../../models/names.json"
import Editable from "../editable/Editable"
import ApiStatusIndicator from "./ApiStatusIndicator"

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
    entryName in names
      ? names[entryName as keyof typeof names]
      : { singular: "", plural: "" }

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
      <ApiStatusIndicator
        status={status}
        style={{
          position: "fixed",
          top: "calc(var(--mantine-header-height, 0px) + 8px)",
          right: 8,
        }}
      />
      {data && (
        <Editable template={template} data={data as any} onSubmit={apiUpdate} />
      )}
    </Stack>
  )
}

export default ApiEntryEditable
