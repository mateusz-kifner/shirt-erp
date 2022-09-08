import { Button, Modal, Stack, Text } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { Plus } from "tabler-icons-react"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import EditableApiEntry from "../../../components/editable/EditableApiEntry"
import EditableText from "../../../components/editable/EditableText"
import useStrapi from "../../../hooks/useStrapi"
import { EmailMessageType } from "../../../types/EmailMessageType"
import { OrderType } from "../../../types/OrderType"
import OrderListItem from "./OrderListItem"

interface OrderAddModalProps {
  opened: boolean
  onClose: () => void
}

const OrderAddModal = ({ opened, onClose }: OrderAddModalProps) => {
  const [orderName, setOrderName] = useState<any>("Zamówienie")
  const [template, setTemplate] = useState<Partial<OrderType> | null>(null)
  const [mail, setMail] = useState<EmailMessageType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { add, status } = useStrapi<OrderType>("orders")

  useEffect(() => {
    if (!opened) {
      setOrderName("Zamówienie")
      setTemplate(null)
      setMail(null)
    }
  }, [opened])

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title="Utwórz nowe zamówienie"
    >
      <Stack>
        <EditableApiEntry
          label="Mail"
          entryName="email-messages"
          Element={makeDefaultListItem("subject")}
          onSubmit={(mail) => {
            setMail(mail)
            orderName === "Zamówienie" && setOrderName(mail.subject)
          }}
          value={mail}
          withErase
        />
        <EditableApiEntry
          label="Template"
          entryName="orders"
          Element={OrderListItem}
          onSubmit={(template) => {
            setTemplate(template)
            orderName === "Zamówienie" && setOrderName(template.name)
          }}
          value={template}
          withErase
        />
        <EditableText
          label="Nazwa"
          onSubmit={setOrderName}
          value={orderName}
          required
        />

        <Button
          onClick={() => {
            if (orderName.length == 0)
              return setError("Musisz podać nie pustą nazwę zamówienia")
            let new_order = template ? template : {}
            new_order?.id && delete new_order?.id
            new_order?.address?.id && delete new_order.address.id
            new_order["name"] = orderName
            new_order["status"] = "planowane"
            if (mail) {
              new_order["notes"] = mail.textAsHtml
              new_order["files"] = mail.attachments
              new_order["emailMessages"] = [{ ...mail }]
              new_order["emailMessagesText"] = [
                {
                  subject: mail.subject,
                  text: mail.text,
                  date: mail.date,
                  id: mail.id,
                },
              ]
            }
            add(new_order)
            console.log(new_order)
          }}
          leftIcon={<Plus />}
          loading={status === "loading"}
        >
          Utwórz zamówienie
        </Button>
        <Text color="red">{error}</Text>
      </Stack>
    </Modal>
  )
}

export default OrderAddModal
