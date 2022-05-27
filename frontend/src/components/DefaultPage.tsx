import { Group } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import ApiList from "./api/ApiList"
import ResponsivePaper from "./ResponsivePaper"
import ApiEntryDetails from "./api/ApiEntryDetails"

interface DefaultPageProps {
  entryName: string
  schema: object
  ListElement: React.ElementType
}

const DefaultPage: FC<DefaultPageProps> = ({
  entryName,
  schema,
  ListElement,
}) => {
  const [id, setId] = useState<number | null>(null)

  const navigate = useNavigate()
  const params = useParams()
  useEffect(() => {
    if (params?.id && parseInt(params.id) > 0) setId(parseInt(params.id))
  })

  return (
    <Group
      sx={(theme) => ({
        flexWrap: "nowrap",
        alignItems: "flex-start",
        padding: theme.spacing.xl,
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          padding: 0,
        },
      })}
    >
      <ResponsivePaper>
        <ApiList
          ListItem={ListElement}
          entryName={entryName}
          label="Klienci"
          spacing="xl"
          listSpacing="sm"
          onChange={(val: any) => {
            console.log(val)
            setId(val.id)
            navigate("/erp/" + entryName + "/" + val.id)
          }}
        />
      </ResponsivePaper>
      <ResponsivePaper style={{ flexGrow: 1 }}>
        <ApiEntryDetails schema={schema} entryName={entryName} id={id} />
      </ResponsivePaper>
    </Group>
  )
}

export default DefaultPage
