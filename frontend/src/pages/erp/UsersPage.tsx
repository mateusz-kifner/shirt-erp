import { FC } from "react"

import template from "../../data/models/user.template.json"
import UserListItem from "../../components/list_items/UserListItem"
import DefaultPage from "../../components/DefaultPage"

const UsersPage: FC = () => {
  return (
    <DefaultPage
      template={template}
      ListElement={UserListItem}
      entryName="users"
    />
  )
}

export default UsersPage
