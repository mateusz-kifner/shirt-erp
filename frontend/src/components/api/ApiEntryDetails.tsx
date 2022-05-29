import { Stack, LoadingOverlay } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { FC } from "react"
import useStrapi from "../../hooks/useStrapi"
import { useLocation, useParams } from "react-router-dom"
import names from "../../data/configs/names.json"
import Details from "../details/Details"

interface ApiEntryDetailsProps {
  template: any
  entryName: string
  id: number | null
}

const ApiEntryDetails: FC<ApiEntryDetailsProps> = ({
  template,
  entryName,
  id,
}) => {
  const { data, status, update } = useStrapi(entryName, id, {
    query: "populate=*",
  })

  const location = useLocation()
  const params = useParams()

  const entryNameData: any =
    //@ts-ignore
    entryName in names ? names[entryName] : { singular: "", plural: "" }

  useDocumentTitle(
    params.id
      ? "ShirtERP - " +
          entryNameData.singular +
          " " +
          data?.firstname +
          " " +
          data?.lastname
      : "ShirtERP - " + entryNameData.plural
  )

  const apiUpdate = (key: string, val: any) => {
    update({ [key]: val })
  }

  return (
    <Stack style={{ position: "relative", minHeight: 200 }}>
      <Details template={template} data={data} onSubmit={apiUpdate} />
      <LoadingOverlay visible={status === "loading"} radius="xl" />
    </Stack>
  )
}

export default ApiEntryDetails
