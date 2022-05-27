import { FC } from "react"

import client_schema from "../../../schemas/client.schema.json"
import ClientListItem from "./ClientListItem"
import DefaultPage from "../../../components/DefaultPage"

const ClientsPage: FC = () => {
  return (
    <DefaultPage
      schema={client_schema}
      ListElement={ClientListItem}
      entryName="clients"
    />
  )
}

export default ClientsPage
