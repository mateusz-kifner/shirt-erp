import { FC, useRef, useState } from "react"
import SplitPane from "react-split-pane"

import ProcedureDetails from "./ProcedureDetails"
import ProceduresList, { ProceduresListHandle } from "./ProceduresList"

import styles from "../../components/SplitPaneWithSnap.module.css"
import { Button, Modal } from "antd"
import WorkstationsPage from "./WorkstationsPage"

export const procedure_template: any = {
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
    multiline: true,
  },
  workstations: {
    label: "Kroki",
    type: "workstationsIds",
    initialValue: [],
  },
  icon: {
    label: "Ikona",
    type: "image",
  },
  createdAt: {
    label: "Utworzono",
    type: "datetime",
    disabled: true,
  },
  updatedAt: {
    label: "Edytowano",
    type: "datetime",
    disabled: true,
  },
}

const ProductionPage: FC = () => {
  const [workstationsModal, setWorkstationsModal] = useState<boolean>(false)
  const [procedureId, setProcedureId] = useState<number | undefined>()
  const procedureListRef = useRef<ProceduresListHandle>(null)
  return (
    <SplitPane
      split="vertical"
      minSize={180}
      defaultSize={480}
      className={styles.splitpane}
    >
      <div className={styles.pre_pane}>
        <div className={styles.pane}>
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={() => setWorkstationsModal(true)}
          >
            Zarządzaj stanowiskami
          </Button>
          <Modal
            visible={workstationsModal}
            onCancel={() => setWorkstationsModal(false)}
            width={1000000}
            style={{ top: "2rem" }}
            footer={[]}
          >
            <WorkstationsPage />
          </Modal>
          <ProceduresList
            ref={procedureListRef}
            onItemClickId={setProcedureId}
            template={procedure_template}
          />
        </div>
      </div>
      <div className={styles.pre_pane}>
        <div className={styles.pane}>
          <ProcedureDetails
            procedureId={procedureId}
            template={procedure_template}
            onUpdate={procedureListRef.current?.refetch}
          />
        </div>
      </div>
    </SplitPane>
  )
}

export default ProductionPage
