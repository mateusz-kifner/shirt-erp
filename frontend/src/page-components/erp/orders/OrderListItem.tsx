import { Avatar, NavLink } from "@mantine/core"
import { OrderType } from "../../../types/OrderType"
import { truncString } from "../../../utils/truncString"
import { getRandomColorByNumber } from "../../../utils/getRandomColor"

interface OrderListItemProps {
  onChange?: (item: Partial<OrderType>) => void
  value: Partial<OrderType>
  active?: boolean
  disabled?: boolean
}

const OrderListItem = ({
  value,
  onChange,
  active,
  disabled,
}: OrderListItemProps) => {
  return (
    <NavLink
      disabled={disabled}
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
            {value?.name && value.name.substring(0, 2)}
          </Avatar>
        )
      }
      label={value ? value?.name && truncString(value.name, 20) : "⸺"}
      description={value?.status && truncString(value.status, 20)}
      onClick={() => onChange?.(value)}
      active={active}
    />
  )
}

export default OrderListItem
