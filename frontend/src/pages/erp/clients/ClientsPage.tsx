import { FC } from "react"

import template from "../../../data/models/client.template.json"
import ClientListItem from "./ClientListItem"
import DefaultPage from "../../../components/DefaultPage"

const ClientsPage: FC = () => {
  return (
    <DefaultPage
      template={template}
      ListElement={ClientListItem}
      entryName="clients"
    />
  )
}

export default ClientsPage
