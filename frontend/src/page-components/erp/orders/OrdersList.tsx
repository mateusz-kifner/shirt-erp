import { useEffect, useState } from "react"

import ApiList from "../../../components/api/ApiList"
import OrderListItem from "./OrderListItem"
import { useRouter } from "next/router"
import { useTranslation } from "../../../i18n"
import { capitalize } from "lodash"

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
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
      filterKeys={["name", "notes"]}
      onAddElement={onAddElement}
      showAddButton
      exclude={{ name: "Szablon" }}
    />
  )
}

export default OrdersList
