import { FC } from "react"

import schema from "../../../schemas/user.schema.json"
import UserListItem from "./UserListItem"
import DefaultPage from "../../../components/DefaultPage"

const UsersPage: FC = () => {
  return (
    <DefaultPage schema={schema} ListElement={UserListItem} entryName="users" />
  )
}

export default UsersPage
