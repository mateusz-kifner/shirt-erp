import { FC, useState } from "react"
import template from "../../../models/procedure.model.json"
import DefaultPage from "../../../components/DefaultPage"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import Workspace from "../../../components/layout/Workspace"
import { useRouter } from "next/router"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import ProceduresList from "./ProceduresList"
import { Tabs, TabsValue } from "@mantine/core"
import { Affiliate, Robot } from "tabler-icons-react"
import ProcedureAddModal from "./ProcedureAddModal"

const entryName = "procedures"

const ProceduresPage: FC = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false)
  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")
  const currentView = id ? [0, 1] : 0
  return (
    <>
      <Tabs
        variant="outline"
        onTabChange={(tabKey?: TabsValue) => {
          router.push("/erp/" + tabKey)
        }}
        defaultValue={"procedures"}
        styles={(theme) => ({
          tabsList: {
            paddingLeft: theme.spacing.lg,
            paddingRight: theme.spacing.lg,
            paddingTop: theme.spacing.xs,
          },
          root: {
            position: "fixed",
            top: 14,
            zIndex: 99999,
            width: "100%",
          },
        })}
      >
        <Tabs.List>
          <Tabs.Tab icon={<Robot size={14} />} value="workstations">
            Stanowiska pracy
          </Tabs.Tab>
          <Tabs.Tab icon={<Affiliate size={14} />} value="procedures">
            Procedury
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Workspace
        childrenLabels={["Lista klientów", "Właściwości"]}
        defaultViews={currentView}
      >
        <ProceduresList
          selectedId={id}
          onAddElement={() => setOpenAddModal(true)}
        />
        <ApiEntryEditable template={template} entryName={entryName} id={id} />
      </Workspace>
      <ProcedureAddModal
        opened={openAddModal}
        onClose={(id) => {
          setOpenAddModal(false)
          id !== undefined &&
            router.push(`/erp/procedures/${id}?show_views=0&show_views=1`)
        }}
      />
    </>
  )
}

export default ProceduresPage
