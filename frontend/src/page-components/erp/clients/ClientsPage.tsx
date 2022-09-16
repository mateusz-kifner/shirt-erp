import template from "../../../models/client.model.json"

import _ from "lodash"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import { useRouter } from "next/router"
import Workspace from "../../../components/layout/Workspace"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import ClientsList from "./ClientList"
import ClientAddModal from "./ClientAddModal"
import { useState } from "react"

const entryName = "clients"

const ClientsPage = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false)

  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")
  const currentView = id ? [0, 1] : 0

  return (
    <>
      <Workspace
        childrenLabels={["Lista klientów", "Właściwości"]}
        defaultViews={currentView}
      >
        <ClientsList
          selectedId={id}
          onAddElement={() => setOpenAddModal(true)}
        />
        <ApiEntryEditable template={template} entryName={entryName} id={id} />
      </Workspace>
      <ClientAddModal
        opened={openAddModal}
        onClose={() => setOpenAddModal(false)}
      />
    </>
  )
}

export default ClientsPage
