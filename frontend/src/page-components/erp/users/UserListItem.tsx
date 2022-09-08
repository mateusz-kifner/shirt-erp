import { Avatar, NavLink } from "@mantine/core"

import { UserType } from "../../../types/UserType"
import { truncString } from "../../../utils/truncString"

interface UserListItemProps {
  onChange?: (item: Partial<UserType>) => void
  value: Partial<UserType>
  active?: boolean
  disabled?: boolean
}

const UserListItem = ({
  value,
  onChange,
  active,
  disabled,
}: UserListItemProps) => {
  return (
    <NavLink
      disabled={disabled}
      onClick={() => onChange?.(value)}
      icon={
        value && (
          <Avatar radius="xl">
            {value?.displayName?.[0]}
            {value?.displayName?.split(" ")?.[1]?.[0]}
          </Avatar>
        )
      }
      label={
        value ? value?.displayName && truncString(value.displayName, 40) : "⸺"
      }
      description={value?.username && truncString(value.username, 40)}
      active={active}
    />
  )
}

export default UserListItem
