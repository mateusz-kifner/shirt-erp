import { Button, Modal, Stack, Text } from "@mantine/core"
import { omit } from "lodash"
import React, { useEffect, useState } from "react"
import { Plus } from "tabler-icons-react"
import EditableApiEntry from "../../../components/editable/EditableApiEntry"
import EditableText from "../../../components/editable/EditableText"
import useStrapi from "../../../hooks/useStrapi"
import { WorkstationType } from "../../../types/WorkstationType"
import WorkstationListItem from "./WorkstationListItem"

interface WorkstationAddModalProps {
  opened: boolean
  onClose: (id?: number) => void
}

const WorkstationAddModal = ({ opened, onClose }: WorkstationAddModalProps) => {
  const [workstationName, setWorkstationName] = useState<any>("Stanowisko")
  const [template, setTemplate] = useState<Partial<WorkstationType> | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const { add, status } = useStrapi<WorkstationType>("workstations")

  useEffect(() => {
    if (!opened) {
      setWorkstationName("Stanowisko")
      setTemplate(null)
      setError(null)
    }
  }, [opened])

  return (
    <Modal
      opened={opened}
      onClose={() => onClose()}
      size="xl"
      title="Utwórz nowe stanowisko"
    >
      <div className="flex flex-col gap-3">
        <EditableApiEntry
          label="Szablon"
          entryName="workstations"
          Element={WorkstationListItem}
          onSubmit={(template) => {
            setTemplate(template)
            // workstationName === "Klient" && setWorkstationName(template.username)
          }}
          value={template}
          withErase
          listProps={{ defaultSearch: "Szablon", filterKeys: ["name"] }}
        />
        <EditableText
          label="Nazwa"
          onSubmit={setWorkstationName}
          value={workstationName}
          required
        />

        <Button
          onClick={() => {
            if (workstationName.length == 0)
              return setError("Musisz podać nie pustą nazwę stanowiska")
            let newWorkstation = {
              ...(template ? omit(template, "id") : {}),
              name: workstationName,
            }

            add(newWorkstation)
              .then((data) => onClose(data?.data?.id))
              .catch(() => setError("Stanowisko o takiej nazwie istnieje."))

            console.log(newWorkstation)
          }}
          leftIcon={<Plus />}
          loading={status === "loading"}
        >
          Utwórz stanowisko
        </Button>
        <Text color="red">{error}</Text>
      </div>
    </Modal>
  )
}

export default WorkstationAddModal
