import type { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import Workspace from "../../../components/layout/Workspace"
import UsersList from "../../../page-components/erp/users/UsersList"

const UsersPage: NextPage = () => {
  return (
    <div>
      <Workspace>
        <UsersList />
      </Workspace>
    </div>
  )
}

export default UsersPage
