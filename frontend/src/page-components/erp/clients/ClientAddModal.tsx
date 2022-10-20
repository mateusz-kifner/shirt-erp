import { Button, Modal, Stack, Text } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { Plus } from "tabler-icons-react"
import EditableApiEntry from "../../../components/editable/EditableApiEntry"
import EditableText from "../../../components/editable/EditableText"
import useStrapi from "../../../hooks/useStrapi"
import { ClientType } from "../../../types/ClientType"
import ClientListItem from "./ClientListItem"

interface ClientAddModalProps {
  opened: boolean
  onClose: (id?: number) => void
}

const ClientAddModal = ({ opened, onClose }: ClientAddModalProps) => {
  const [clientName, setClientName] = useState<any>("Klient")
  const [template, setTemplate] = useState<Partial<ClientType> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { add, status } = useStrapi<ClientType>("clients")

  useEffect(() => {
    if (!opened) {
      setClientName("Klient")
      setTemplate(null)
      setError(null)
    }
  }, [opened])

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title="Utwórz nowego klienta"
    >
      <Stack>
        <EditableApiEntry
          label="Szablon"
          entryName="clients"
          Element={ClientListItem}
          onSubmit={(template) => {
            setTemplate(template)
            // clientName === "Klient" && setClientName(template.username)
          }}
          value={template}
          withErase
          listProps={{ defaultSearch: "Szablon", filterKeys: ["username"] }}
        />
        <EditableText
          label="Nazwa użytkownika"
          onSubmit={setClientName}
          value={clientName}
          required
        />

        <Button
          onClick={() => {
            if (clientName.length == 0)
              return setError("Musisz podać nie pustą nazwę użytkownika")
            let new_client = template ? template : {}
            new_client?.id && delete new_client?.id
            new_client?.address?.id && delete new_client.address.id
            new_client.username = clientName
            add(new_client).then((data) => onClose(data?.data?.id))
          }}
          leftIcon={<Plus />}
          loading={status === "loading"}
        >
          Utwórz klienta
        </Button>
        <Text color="red">{error}</Text>
      </Stack>
    </Modal>
  )
}

export default ClientAddModal
