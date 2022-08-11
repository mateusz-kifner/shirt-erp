import React from "react"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import Workspace from "../../../components/layout/Workspace"
import ClientsList from "./ClientList"
import template from "../../../models/client.model.json"

const entryName = "clients"

interface ClientViewProps {
  id: number | null
}

const ClientView = ({ id }: ClientViewProps) => {
  return (
    <Workspace>
      <ClientsList selectedId={id} />
      <ApiEntryEditable template={template} entryName={entryName} id={id} />
    </Workspace>
  )
}

export default ClientView
