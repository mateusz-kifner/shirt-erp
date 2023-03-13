import { useState } from "react"
import template from "../../../models/procedure.model.json"
import DefaultPage from "../../../components/DefaultPage"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import Workspace from "../../../components/layout/Workspace"
import { useRouter } from "next/router"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import ProceduresList from "./ProceduresList"
import { Tabs, TabsValue } from "@mantine/core"
import {
  IconAffiliate,
  IconList,
  IconNotebook,
  IconRobot,
} from "@tabler/icons-react"
import ProcedureAddModal from "./ProcedureAddModal"

const entryName = "procedures"

const ProceduresPage = () => {
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
          // root: {
          //   position: "fixed",
          //   top: 14,
          //   zIndex: 101,
          //   width: "100%",
          // },
        })}
      >
        <Tabs.List>
          <Tabs.Tab icon={<IconRobot size={14} />} value="workstations">
            Stanowiska pracy
          </Tabs.Tab>
          <Tabs.Tab icon={<IconAffiliate size={14} />} value="procedures">
            Procedury
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Workspace
        childrenLabels={
          id ? ["Lista procedur", "Właściwości"] : ["Lista procedur"]
        }
        childrenIcons={[IconList, IconNotebook]}
      >
        <ProceduresList
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
      <ProcedureAddModal
        opened={openAddModal}
        onClose={(id) => {
          setOpenAddModal(false)
          console.log(id)
          id !== undefined &&
            router.push(`/erp/procedures/${id}?pinned=0&active=1`)
        }}
      />
    </>
  )
}

export default ProceduresPage
