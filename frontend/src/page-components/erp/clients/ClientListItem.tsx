import { Avatar, NavLink } from "@mantine/core"

import { ClientType } from "../../../types/ClientType"
import { getRandomColorByNumber } from "../../../utils/getRandomColor"
import { truncString } from "../../../utils/truncString"

interface ClientListItemProps {
  onChange?: (item: Partial<ClientType>) => void
  value: Partial<ClientType>
  active?: boolean
  disabled?: boolean
}

const ClientListItem = ({
  value,
  onChange,
  active,
  disabled,
}: ClientListItemProps) => {
  return (
    <NavLink
      disabled={disabled}
      onClick={() => onChange?.(value)}
      icon={
        value && (
          <Avatar
            radius="xl"
            styles={{
              placeholder: {
                background: `radial-gradient(circle, transparent 64%, ${getRandomColorByNumber(
                  value.id
                )}  66%)`,
              },
            }}
          >
            {value?.firstname?.[0]}
            {value?.lastname?.[0]}
          </Avatar>
        )
      }
      label={
        value
          ? (value?.firstname && value.firstname?.length > 0) ||
            (value?.lastname && value.lastname?.length > 0)
            ? truncString(value.firstname + " " + value.lastname, 40)
            : truncString(value?.username ?? "", 40)
          : "⸺"
      }
      description={
        (value?.email ? truncString(value.email, 20) : "") +
        (value?.email || value?.companyName ? " | " : "") +
        (value?.companyName ? truncString(value.companyName, 20) : "")
      }
      active={active}
    />
  )
}

export default ClientListItem
