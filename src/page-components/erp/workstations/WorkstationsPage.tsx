import { useState } from "react"

import template from "../../../models/workstation.model.json"
import Workspace from "../../../components/layout/Workspace"
import { useRouter } from "next/router"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import WorkstationsList from "./WorkstationsList"
import WorkstationAddModal from "./WorkstationAddModal"
import { Tabs, TabsValue } from "@mantine/core"
import {
  IconAffiliate,
  IconList,
  IconNotebook,
  IconRobot,
} from "@tabler/icons-react"

const entryName = "workstations"

const WorkstationsPage = () => {
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
        defaultValue={"workstations"}
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
          id ? ["Lista stanowisk", "Właściwości"] : ["Lista stanowisk"]
        }
        childrenIcons={[IconList, IconNotebook]}
      >
        <WorkstationsList
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
      <WorkstationAddModal
        opened={openAddModal}
        onClose={(id) => {
          setOpenAddModal(false)
          id !== undefined &&
            router.push(`/erp/workstations/${id}?pinned=0&active=1`)
        }}
      />
    </>
  )
}

export default WorkstationsPage