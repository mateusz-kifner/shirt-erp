import { Stack, LoadingOverlay } from "@mantine/core"
import { useDocumentTitle } from "@mantine/hooks"
import { FC } from "react"
import useStrapi from "../../hooks/useStrapi"
import { useLocation, useParams } from "react-router-dom"
import names from "../../schemas/names.json"
import Details from "../details/Details"

interface ApiEntryDetailsProps {
  schema: any
  entryName: string
  id: number | null
}

const ApiEntryDetails: FC<ApiEntryDetailsProps> = ({
  schema,
  entryName,
  id,
}) => {
  const { data, status } = useStrapi(entryName, id)

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

  return (
    <Stack style={{ position: "relative", minHeight: 200 }}>
      <Details schema={schema} data={data} />
      <LoadingOverlay visible={status === "loading"} radius="xl" />
    </Stack>
  )
}

export default ApiEntryDetails
