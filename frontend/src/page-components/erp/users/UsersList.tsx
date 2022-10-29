import { useEffect, useState } from "react"

import ApiList from "../../../components/api/ApiList"
import UserListItem from "./UserListItem"
import _ from "lodash"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"

const entryName = "users"

const UsersList = () => {
  const [id, setId] = useState<number | null>(null)
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <ApiList
      ListItem={UserListItem}
      entryName={entryName}
      label={
        entryName ? _.capitalize(t(`${entryName}.singular` as any)) : undefined
      }
      selectedId={id}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
      showAddButton
    />
  )
}

export default UsersList
