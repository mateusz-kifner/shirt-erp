import { Group } from "@mantine/core"
import { FC, useEffect, useState } from "react"

import ApiList from "../../../components/api/ApiList"
import client_schema from "../../../schemas/client.schema.json"
import ClientListItem from "./ClientListItem"
import ResponsivePaper from "../../../components/ResponsivePaper"
import ApiEntryDetails from "../../../components/api/ApiEntryDetails"
import { useNavigate, useParams } from "react-router-dom"
import { useDocumentTitle } from "@mantine/hooks"

const ENTRY_NAME = "clients"

const ClientsPage: FC = () => {
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
          ListItem={ClientListItem}
          entryName={ENTRY_NAME}
          label="Klienci"
          spacing="xl"
          listSpacing="sm"
          onChange={(val: any) => {
            console.log(val)
            setId(val.id)
            navigate("/erp/" + ENTRY_NAME + "/" + val.id)
          }}
        />
      </ResponsivePaper>
      <ResponsivePaper style={{ flexGrow: 1 }}>
        <ApiEntryDetails
          schema={client_schema}
          entryName={ENTRY_NAME}
          id={id}
        />
      </ResponsivePaper>
    </Group>
  )
}

export default ClientsPage
