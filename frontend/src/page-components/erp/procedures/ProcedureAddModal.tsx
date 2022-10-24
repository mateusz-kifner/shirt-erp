import { Button, Modal, Stack, Text } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { Plus } from "tabler-icons-react"
import EditableApiEntry from "../../../components/editable/EditableApiEntry"
import EditableText from "../../../components/editable/EditableText"
import useStrapi from "../../../hooks/useStrapi"
import { ProcedureType } from "../../../types/ProcedureType"
import ProcedureListItem from "./ProcedureListItem"

interface ProcedureAddModalProps {
  opened: boolean
  onClose: (id?: number) => void
}

const ProcedureAddModal = ({ opened, onClose }: ProcedureAddModalProps) => {
  const [procedureName, setProcedureName] = useState<any>("Procedura")
  const [template, setTemplate] = useState<Partial<ProcedureType> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { add, status } = useStrapi<ProcedureType>("procedures")

  useEffect(() => {
    if (!opened) {
      setProcedureName("Procedura")
      setTemplate(null)
      setError(null)
    }
  }, [opened])

  return (
    <Modal
      opened={opened}
      onClose={() => onClose()}
      size="xl"
      title="Utwórz nową procedura"
    >
      <Stack>
        <EditableApiEntry
          label="Szablon"
          entryName="procedures"
          Element={ProcedureListItem}
          onSubmit={(template) => {
            setTemplate(template)
          }}
          value={template}
          withErase
          listProps={{ defaultSearch: "Szablon", filterKeys: ["name"] }}
        />
        <EditableText
          label="Nazwa"
          onSubmit={setProcedureName}
          value={procedureName}
          required
        />

        <Button
          onClick={() => {
            if (procedureName.length == 0)
              return setError("Musisz podać nie pustą nazwę procedury")
            let newProcedure = template ? template : {}
            newProcedure?.id && delete newProcedure?.id
            newProcedure.name = procedureName
            add(newProcedure).then((data) => onClose(data?.data?.id))
            console.log(newProcedure)
          }}
          leftIcon={<Plus />}
          loading={status === "loading"}
        >
          Utwórz procedure
        </Button>
        <Text color="red">{error}</Text>
      </Stack>
    </Modal>
  )
}

export default ProcedureAddModal