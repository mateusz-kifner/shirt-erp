import { FC, useEffect, useState } from "react"

import ApiList from "../../../components/api/ApiList"
import OrderListItem from "./OrderListItem"
import _ from "lodash"
import names from "../../../models/names.json"
import { useRouter } from "next/router"

const entryName = "orders"
const label =
  entryName && entryName in names
    ? _.capitalize(names[entryName as keyof typeof names].plural)
    : undefined

interface OrderListProps {
  selectedId: number | null
  onAddElement: () => void
}

const OrdersList = ({ selectedId, onAddElement }: OrderListProps) => {
  const router = useRouter()

  return (
    <ApiList
      ListItem={OrderListItem}
      entryName={entryName}
      label={label}
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
    />
  )
}

export default OrdersList
