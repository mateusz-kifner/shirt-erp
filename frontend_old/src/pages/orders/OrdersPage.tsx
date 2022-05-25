import { FC } from "react"
import { Text } from "@mantine/core"
import { Box } from "tabler-icons-react"
import ApiIconSVG from "../../components/api/ApiIconSVG"

const OrdersPage: FC = () => {
  return (
    <div>
      <Text>OrdersPage</Text>
      <ApiIconSVG entryName="productCategories" id={10} color="#f00" />
      <Box color="#f00" />
      <Text>dadfsfdaf</Text>
    </div>
  )
}

export default OrdersPage
