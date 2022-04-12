import { FC } from "react"
import { Card } from "antd"
import { UserType } from "../../types/UserType"

const { Meta } = Card

interface UsersProps {
  users: UserType[]
}

const Users: FC<UsersProps> = ({ users }) => {
  return (
    <div>
      {users && users.length > 0 ? (
        users.map((user: UserType) => (
          <Card
            key={"user" + user.id}
            style={{
              height: "100%",
              width: "100%",
              margin: 0,
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
            }}
          >
            <Meta
              title={user?.displayName ? user?.displayName : ""}
              description={user.username}
            />
          </Card>
        ))
      ) : (
        <div>Brak</div>
      )}
    </div>
  )
}

export default Users
