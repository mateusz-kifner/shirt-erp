import template from "../../../models/client.model.json"

import _ from "lodash"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import { useRouter } from "next/router"
import Workspace from "../../../components/layout/Workspace"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import ClientsList from "./ClientList"

const entryName = "clients"

const ClientsPage = () => {
  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")

  return (
    <Workspace
      childrenLabels={["Lista klientów", "Właściwości"]}
      childrenWrapperProps={[undefined, { style: { flexGrow: 1 } }]}
    >
      <ClientsList selectedId={id} />
      <ApiEntryEditable template={template} entryName={entryName} id={id} />
    </Workspace>
  )
}

export default ClientsPage
