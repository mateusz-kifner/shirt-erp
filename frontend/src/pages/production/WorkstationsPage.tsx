import { FC, useRef, useState } from "react"
import SplitPane from "react-split-pane"

import WorkstationDetails from "./WorkstationDetails"
import WorkstationsList, { WorkstationsListHandle } from "./WorkstationsList"

import styles from "../../components/SplitPaneWithSnap.module.css"

export const workstation_template: any = {
  id: {
    label: "id",
    type: "id",
  },
  name: {
    label: "Nazwa",
    type: "string",
    initialValue: "",
    required: true,
  },
  desc: {
    label: "Opis",
    type: "string",
    initialValue: "",
  },
  numberOfJobs: {
    label: "Ilość stanowisk",
    type: "number",
    initialValue: 0,
  },
  icon: {
    label: "Ikona",
    type: "image",
  },
  nextWorkstations: {
    label: "Następne stanowisko",
    type: "workstations",
  },
  created_at: {
    label: "Utworzono",
    type: "datetime",
    disabled: true,
  },
  updated_at: {
    label: "Edytowano",
    type: "datetime",
    disabled: true,
  },
}

const WorkstationsPage: FC = () => {
  const [workstationId, setWorkstationId] = useState<number | undefined>()
  const workstationListRef = useRef<WorkstationsListHandle>(null)
  return (
    <div
      style={{
        minHeight: "80vh",
        paddingTop: "2rem",
        position: "relative",
      }}
    >
      <SplitPane
        split="vertical"
        minSize={180}
        defaultSize={480}
        className={styles.splitpane}
        style={{ margin: 0, padding: 0 }}
      >
        <div className={styles.pre_pane}>
          <div className={styles.pane}>
            <WorkstationsList
              ref={workstationListRef}
              onItemClickId={setWorkstationId}
              template={workstation_template}
            />
          </div>
        </div>
        <div className={styles.pre_pane}>
          <div className={styles.pane}>
            <WorkstationDetails
              workstationId={workstationId}
              template={workstation_template}
              onUpdate={workstationListRef.current?.refetch}
            />
          </div>
        </div>
      </SplitPane>
    </div>
  )
}

export default WorkstationsPage
