import { Avatar, NavLink } from "@mantine/core"
import dayjs from "dayjs"
import { EmailMessageType } from "../../../types/EmailMessageType"
import { getRandomColorByString } from "../../../utils/getRandomColor"
import { truncString } from "../../../utils/truncString"

interface EmailMessageListItemProps {
  onChange?: (item: Partial<EmailMessageType>) => void
  value: Partial<EmailMessageType>
  active?: boolean
  disabled?: boolean
}

const EmailMessageListItem = ({
  value,
  onChange,
  active,
  disabled,
}: EmailMessageListItemProps) => {
  return (
    <NavLink
      disabled={disabled}
      onClick={() => onChange?.(value)}
      styles={{
        description: {
          whiteSpace: "pre-wrap",
        },
      }}
      icon={
        value && (
          <Avatar
            radius="xl"
            styles={{
              placeholder: {
                background: `radial-gradient(circle, transparent 64%, ${getRandomColorByString(
                  value.from
                )}  66%)`,
              },
            }}
          >
            {value.from?.substring(0, 2).toUpperCase()}
          </Avatar>
        )
      }
      label={value ? value.subject && truncString(value.subject, 40) : "⸺"}
      description={
        (value?.from ?? "") +
        (value?.date ? "\n" + dayjs(value?.date).format("LT L").toString() : "")
      }
      active={active}
    />
  )
}

export default EmailMessageListItem
