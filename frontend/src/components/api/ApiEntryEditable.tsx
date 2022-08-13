import { Stack, LoadingOverlay } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { useRouter } from "next/router"
import { FC } from "react"
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
  const { data, status, update } = useStrapi<EntryType>(entryName, id, {
    query: "populate=*",
  })

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
    update({ [key]: val } as Partial<EntryType>)
  }

  return (
    <Stack style={{ position: "relative", minHeight: 200 }}>
      {data && (
        <Editable template={template} data={data as any} onSubmit={apiUpdate} />
      )}
      <LoadingOverlay visible={status === "loading"} radius="xl" />
    </Stack>
  )
}

export default ApiEntryEditable
