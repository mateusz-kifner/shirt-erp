import ApiList from "../../../components/api/ApiList"
import OrderListItem from "./OrderListItem"
import { useRouter } from "next/router"
import { useTranslation } from "../../../i18n"
import { capitalize } from "lodash"
import axios from "axios"
import { ActionIcon } from "@mantine/core"
import { IconArchive } from "@tabler/icons-react"
import Link from "next/link"

const entryName = "orders"

interface OrderListProps {
  selectedId: number | null
  onAddElement: () => void
}

const OrdersList = ({ selectedId, onAddElement }: OrderListProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <ApiList
      ListItem={OrderListItem}
      entryName={entryName}
      label={
        entryName ? capitalize(t(`${entryName}.plural` as any)) : undefined
      }
      selectedId={selectedId}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      onRefresh={() => {
        axios
          .get("/email-messages/refresh")
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err))
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
      filterKeys={["name", "notes"]}
      onAddElement={onAddElement}
      showAddButton
      exclude={{ name: "Szablon" }}
      buttonSection={
        <Link href={"/erp/order-archives"} passHref>
          <ActionIcon size="lg" radius="xl" variant="default">
            <IconArchive />
          </ActionIcon>
        </Link>
      }
    />
  )
}

export default OrdersList
