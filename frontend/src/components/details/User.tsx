import { FC } from "react"
import { Card } from "antd"
import { UserType } from "../../types/UserType"

const { Meta } = Card
interface UserProps {
  user: UserType
}

const User: FC<UserProps> = ({ user }) => {
  return (
    <Card
      style={{
        height: "100%",
        width: "100%",
        margin: 0,
        border: "none",
      }}
    >
      {user ? (
        <Meta title={user.displayName} description={user.username} />
      ) : (
        <Meta title="Nie podano klienta" />
      )}
    </Card>
  )
}
export default User
