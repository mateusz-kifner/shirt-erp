import { useEffect, useState } from "react"

import ApiList from "../../../components/api/ApiList"
import _ from "lodash"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"

const entryName = "orders-archive"

const OrdersArchiveList = () => {
  const [id, setId] = useState<number | null>(null)
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <ApiList
      ListItem={makeDefaultListItem("name")}
      entryName={entryName}
      label={
        entryName ? _.capitalize(t(`${entryName}.plural` as any)) : undefined
      }
      selectedId={id}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
    />
  )
}

export default OrdersArchiveList
