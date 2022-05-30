import { FC } from "react"

import template from "../../templates/client.template.json"
import ClientListItem from "../../components/list_items/ClientListItem"
import DefaultPage from "../../components/DefaultPage"

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
