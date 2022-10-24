import template from "../../../models/user.model.json"
import UserListItem from "./UserListItem"
import DefaultPage from "../../../components/DefaultPage"

const UsersPage = () => {
  return (
    <DefaultPage
      template={template}
      ListElement={UserListItem}
      entryName="users"
    />
  )
}

export default UsersPage
