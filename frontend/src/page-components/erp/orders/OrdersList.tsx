import { FC, useEffect, useState } from "react"

import ApiList from "../../../components/api/ApiList"
import OrderListItem from "./OrderListItem"
import _ from "lodash"
import names from "../../../models/names.json"
import { useRouter } from "next/router"

const entryName = "orders"

const OrdersList: FC = () => {
  const [id, setId] = useState<number | null>(null)
  const router = useRouter()

  return (
    <ApiList
      ListItem={OrderListItem}
      entryName={entryName}
      label={
        entryName && entryName in names
          ? _.capitalize(names[entryName as keyof typeof names].plural)
          : undefined
      }
      spacing="xl"
      listSpacing="sm"
      selectedId={id}
      onChange={(val: any) => {
        console.log(val)
        setId(val.id)
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
    />
  )
}

export default OrdersList
