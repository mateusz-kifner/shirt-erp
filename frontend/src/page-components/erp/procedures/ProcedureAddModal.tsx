import { Button, Modal, Stack, Text } from "@mantine/core"
import { omit } from "lodash"
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
      <div className="flex flex-col gap-3">
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
            const new_procedure = {
              ...(template ? omit(template, "id") : {}),
              name: procedureName,
            }

            add(new_procedure)
              .then((data) => onClose(data?.data?.id))
              .catch(() => setError("Procedura o takiej nazwie istnieje."))
            console.log(new_procedure)
          }}
          leftIcon={<Plus />}
          loading={status === "loading"}
        >
          Utwórz procedure
        </Button>
        <Text color="red">{error}</Text>
      </div>
    </Modal>
  )
}

export default ProcedureAddModal
