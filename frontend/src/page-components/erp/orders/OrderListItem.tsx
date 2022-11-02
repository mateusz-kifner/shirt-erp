import { Avatar, Indicator, NavLink } from "@mantine/core"
import { OrderType } from "../../../types/OrderType"
import { truncString } from "../../../utils/truncString"
import { getRandomColorByNumber } from "../../../utils/getRandomColor"
import dayjs from "dayjs"
import { CalendarTime } from "tabler-icons-react"

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
  const timeLeft = value?.dateOfCompletion
    ? dayjs(value?.dateOfCompletion).diff(dayjs(), "day")
    : null

  const color =
    timeLeft !== null
      ? timeLeft < 1
        ? "#F03E3E"
        : timeLeft < 3
        ? "#FF922B"
        : timeLeft < 5
        ? "#FAB005"
        : "transparent"
      : "transparent"

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
      description={
        (value?.status ? truncString(value.status, 20) + " | " : "") +
        (value?.dateOfCompletion
          ? dayjs(value?.dateOfCompletion).fromNow()
          : "")
      }
      onClick={() => onChange?.(value)}
      active={active}
      rightSection={
        !(
          value.status === "odrzucone" ||
          value.status === "archiwizowane" ||
          value.status === "wysłane"
        ) &&
        timeLeft !== null &&
        timeLeft > -1 ? (
          <CalendarTime size={18} stroke={color} />
        ) : undefined
      }
    />
  )
}

export default OrderListItem
