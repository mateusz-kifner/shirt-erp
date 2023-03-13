import React, { useId, useMemo, useState } from "react"
import { OrderType } from "../../../types/OrderType"
import { Accordion, Modal, Stack, Text, Title } from "@mantine/core"
import axios from "axios"
import { IconRefresh, IconEdit } from "@tabler/icons-react"
import FloatingActions from "../../../components/FloatingActions"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import dayjs from "dayjs"

const template = {
  emailMessages: {
    type: "array",
    arrayType: "apiEntry",
    entryName: "email-messages",
    linkEntry: true,
    allowClear: true,
  },
}

interface OrderMessagesViewProps {
  order?: Partial<OrderType>
  refetch?: () => void
}

const OrderMessagesView = (props: OrderMessagesViewProps) => {
  const { order, refetch } = props
  const uuid = useId()

  const [active, setActive] = useState<boolean>(false)
  const [opened, setOpened] = useState<boolean>(false)

  const emailMessagesSorted = useMemo(
    () =>
      (order &&
        order.emailMessages &&
        Array.isArray(order?.emailMessages) &&
        order.emailMessages.sort((a, b) =>
          dayjs(b.date).diff(dayjs(a.date))
        )) ||
      null,
    [order?.emailMessages]
  )

  return (
    <Stack style={{ position: "relative" }}>
      <Accordion defaultValue={"email0"} variant="separated">
        {emailMessagesSorted && emailMessagesSorted.length > 0 ? (
          emailMessagesSorted.map((val, index, arr) => (
            <Accordion.Item
              value={"email" + index}
              key={uuid + "_mail_" + index}
            >
              <Accordion.Control>
                <Title order={5}>{val.subject}</Title>
              </Accordion.Control>
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
        />
      </Modal>
      {/* <Editable active={active} template={template} data={order ?? {}} /> */}
      <FloatingActions
        actions={[
          () => setOpened((val) => !val),

          () => {
            axios
              .get("/email-messages/refresh")
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err))
            refetch?.()
          },
        ]}
        actionIcons={[
          <IconEdit size={28} key={uuid + "_icon1"} />,
          <IconRefresh size={20} key={uuid + "_icon2"} />,
        ]}
      />
    </Stack>
  )
}

export default OrderMessagesView
