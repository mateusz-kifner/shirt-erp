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
}

const OrdersList = ({ selectedId }: OrderListProps) => {
  const router = useRouter()

  return (
    <ApiList
      ListItem={OrderListItem}
      entryName={entryName}
      label={label}
      selectedId={selectedId}
      onChange={(val: any) => {
        console.log(val)
        // setId(val.id)
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
    />
  )
}

export default OrdersList
