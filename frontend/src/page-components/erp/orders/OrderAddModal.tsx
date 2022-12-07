import { Button, Modal, Stack, Text } from "@mantine/core"
import dayjs from "dayjs"
import { omit } from "lodash"
import React, { useEffect, useState } from "react"
import { Plus } from "tabler-icons-react"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import EditableApiEntry from "../../../components/editable/EditableApiEntry"
import EditableText from "../../../components/editable/EditableText"
import useStrapi from "../../../hooks/useStrapi"
import { EmailMessageType } from "../../../types/EmailMessageType"
import { OrderType } from "../../../types/OrderType"
import EmailMessageListItem from "../email-messages/EmailMessageListItem"
import OrderListItem from "./OrderListItem"

interface OrderAddModalProps {
  opened: boolean
  onClose: (id?: number) => void
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
      onClose={() => onClose()}
      size="xl"
      title="Utwórz nowe zamówienie"
    >
      <div className="flex flex-col gap-3">
        <EditableApiEntry
          label="Mail"
          entryName="email-client/messages"
          Element={EmailMessageListItem}
          onSubmit={(mail) => {
            setMail(mail)
            orderName === "Zamówienie" && setOrderName(mail.subject)
          }}
          value={mail}
          withErase
        />
        <EditableApiEntry
          label="Szablon"
          entryName="orders"
          Element={OrderListItem}
          onSubmit={(template) => {
            setTemplate(template)
            orderName === "Zamówienie" && setOrderName(template.name)
          }}
          value={template}
          withErase
          listProps={{ defaultSearch: "Szablon", filterKeys: ["name"] }}
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
            const new_order = {
              ...(template ? omit(template, "id") : {}),
              name: orderName,
              status: "planned",
              dateOfCompletion: dayjs().toISOString(),
              ...(mail
                ? {
                    notes: mail.textAsHtml,
                    files: mail.attachments,
                    emailMessages: [{ ...mail }],
                    emailMessagesText: [
                      {
                        subject: mail.subject,
                        text: mail.text,
                        date: mail.date,
                        id: mail.id,
                      },
                    ],
                  }
                : {}),
            }

            add(new_order)
              .then((data) => {
                console.log("add fetch ", data)
                onClose(data?.data?.id)
              })
              .catch(() => setError("Zamówienie o takiej nazwie istnieje."))
          }}
          leftIcon={<Plus />}
          loading={status === "loading"}
        >
          Utwórz zamówienie
        </Button>
        <Text color="red">{error}</Text>
      </div>
    </Modal>
  )
}

export default OrderAddModal
