import template from "../../../models/client.model.json"

import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import { useRouter } from "next/router"
import Workspace from "../../../components/layout/Workspace"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import ClientsList from "./ClientList"
import ClientAddModal from "./ClientAddModal"
import { useState } from "react"
import { List, Notebook } from "tabler-icons-react"
import { useMediaQuery } from "@mantine/hooks"

const entryName = "clients"

const ClientsPage = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false)
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)"
  )
  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")

  return (
    <>
      <Workspace
        childrenLabels={
          id ? ["Lista klientów", "Właściwości"] : ["Lista klientów"]
        }
        childrenIcons={[List, Notebook]}
        defaultActive={id ? 1 : 0}
        defaultPinned={isMobile ? [] : id ? [0] : []}
      >
        <ClientsList
          selectedId={id}
          onAddElement={() => setOpenAddModal(true)}
        />
        <ApiEntryEditable
          template={template}
          entryName={entryName}
          id={id}
          allowDelete
        />
      </Workspace>
      <ClientAddModal
        opened={openAddModal}
        onClose={(id) => {
          setOpenAddModal(false)
          id !== undefined &&
            router.push(`/erp/clients/${id}?pinned=0&active=1`)
        }}
      />
    </>
  )
}

export default ClientsPage
