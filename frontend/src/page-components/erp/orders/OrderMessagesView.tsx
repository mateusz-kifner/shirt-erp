import React, { useId, useState } from "react"
import { OrderType } from "../../../types/OrderType"
import { Accordion, ActionIcon, Modal, Stack, Text, Title } from "@mantine/core"
import axios from "axios"
import { LockOpen, Refresh, Lock, Edit } from "tabler-icons-react"
import FloatingActions from "../../../components/FloatingActions"
import Editable from "../../../components/editable/Editable"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import dayjs from "dayjs"

const template = {
  emailMessages: {
    label: "E-maile",
    type: "array",
    arrayType: "apiEntry",
    entryName: "email-messages",
    linkEntry: true,
    allowClear: true,
  },
}

interface OrderMessagesViewProps {
  order?: Partial<OrderType>
}

const OrderMessagesView = (props: OrderMessagesViewProps) => {
  const uuid = useId()
  const { order } = props

  const [active, setActive] = useState<boolean>(false)
  const [opened, setOpened] = useState<boolean>(false)

  return (
    <Stack style={{ position: "relative" }}>
      <Accordion defaultValue={"email0"}>
        {order &&
        order.emailMessages &&
        Array.isArray(order?.emailMessagesText) ? (
          order.emailMessages
            .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
            .map((val, index, arr) => (
              <Accordion.Item
                value={"email" + index}
                key={uuid + "_mail_" + index}
              >
                <Accordion.Control>{val.subject}</Accordion.Control>
                <Accordion.Panel>
                  <Text style={{ whiteSpace: "pre-wrap" }}>{val.text}</Text>
                </Accordion.Panel>
              </Accordion.Item>
            ))
        ) : (
          <Text>Brak e-maili</Text>
        )}
      </Accordion>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="xl"
        title="Maile"
      >
        <ApiEntryEditable
          template={template}
          entryName={"orders"}
          id={order?.id ?? null}
          forceActive
        />
      </Modal>
      {/* <Editable active={active} template={template} data={order ?? {}} /> */}
      <FloatingActions
        actions={[
          () => setOpened((val) => !val),

          () =>
            axios
              .get("/email-messages/refresh")
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err)),
        ]}
        actionIcons={[
          <Edit size={28} key={uuid + "_icon1"} />,
          <Refresh size={20} key={uuid + "_icon2"} />,
        ]}
      />
    </Stack>
  )
}

export default OrderMessagesView
