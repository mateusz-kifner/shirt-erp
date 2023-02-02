import React, { useId } from "react"
import { OrderType } from "../../../types/OrderType"
import { ActionIcon, Text } from "@mantine/core"
import axios from "axios"
import { Refresh } from "tabler-icons-react"
import FloatingActions from "../../../components/FloatingActions"

interface OrderMessagesViewProps {
  order?: Partial<OrderType>
}

const OrderMessagesView = (props: OrderMessagesViewProps) => {
  const uuid = useId()
  const { order } = props
  return (
    <div style={{ position: "relative" }}>
      {order && Array.isArray(order?.emailMessagesText) ? (
        order.emailMessagesText.map((val, index) => (
          <Text
            style={{ whiteSpace: "pre-wrap" }}
            key={uuid + "_mail_" + index}
          >
            {val.text}
          </Text>
        ))
      ) : (
        <Text>Brak e-maili</Text>
      )}
      <FloatingActions
        actions={[
          () => {},
          () =>
            axios
              .get("/email-messages/refresh")
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err)),
        ]}
        actionIcons={[<Refresh size={20} key={uuid + "_icon1"} />]}
        // style={{ zIndex: 0 }}
      />
    </div>
  )
}

export default OrderMessagesView
