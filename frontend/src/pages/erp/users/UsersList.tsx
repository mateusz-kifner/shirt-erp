import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ApiList from "../../../components/api/ApiList"
import UserListItem from "./UserListItem"
import _ from "lodash"
import names from "../../../models/names.json"

const entryName = "users"

const UsersList: FC = () => {
  const [id, setId] = useState<number | null>(null)
  const navigate = useNavigate()

  return (
    <ApiList
      ListItem={UserListItem}
      entryName={entryName}
      label={
        entryName && entryName in names
          ? _.capitalize(names[entryName as keyof typeof names].plural)
          : undefined
      }
      spacing="xl"
      listSpacing="sm"
      entryId={id}
      onChange={(val: any) => {
        console.log(val)
        setId(val.id)
        navigate("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
    />
  )
}

export default UsersList
