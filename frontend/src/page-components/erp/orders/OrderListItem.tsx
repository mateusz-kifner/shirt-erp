import { Avatar, Indicator, NavLink } from "@mantine/core"
import { OrderType } from "../../../types/OrderType"
import { truncString } from "../../../utils/truncString"
import {
  getRandomColorByNumber,
  getRandomColorByString,
} from "../../../utils/getRandomColor"
import dayjs from "dayjs"
import { CalendarTime } from "tabler-icons-react"
import { useTranslation } from "../../../i18n"

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
  const { t } = useTranslation()
  const todayDate = dayjs().format("YYYY-MM-DD")
  const timeLeft = value?.dateOfCompletion
    ? dayjs(value?.dateOfCompletion).diff(todayDate, "day")
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

  const dateDisplay = value?.dateOfCompletion
    ? (timeLeft !== null && timeLeft < 0) ||
      value?.status === "rejected" ||
      value?.status === "archived" ||
      value?.status === "sent"
      ? dayjs(value?.dateOfCompletion).format("L")
      : timeLeft === 0
      ? t("today")
      : dayjs(value?.dateOfCompletion).from(todayDate)
    : ""
  return (
    <NavLink
      disabled={disabled}
      icon={
        value && (
          <Avatar
            radius="xl"
            styles={{
              placeholder: {
                background: `radial-gradient(circle, transparent 64%, ${
                  value?.client?.id
                    ? getRandomColorByNumber(value?.client?.id)
                    : "#333"
                }  66%)`,
              },
            }}
          >
            {value?.name && value.name.substring(0, 2)}
          </Avatar>
        )
      }
      label={value ? value?.name && truncString(value.name, 20) : "⸺"}
      description={
        (value?.status ? truncString(t(value.status), 20) + " | " : "") +
        dateDisplay +
        (value?.client?.firstname || value?.client?.lastname ? " | " : "") +
        (value?.client?.firstname ? value?.client?.firstname + " " : "") +
        (value?.client?.lastname ?? "")
      }
      onClick={() => onChange?.(value)}
      active={active}
      rightSection={
        !(
          value?.status === "rejected" ||
          value?.status === "archived" ||
          value?.status === "sent"
        ) && timeLeft !== null ? (
          <CalendarTime size={18} stroke={color} />
        ) : undefined
      }
    />
  )
}

export default OrderListItem
