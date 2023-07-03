import { Avatar, Indicator, NavLink, Tooltip } from "@mantine/core"
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
  const short_message = value?.text
    ?.split("\n")
    ?.filter((line) => line.indexOf(">") != 0 && line.length > 0)
    ?.join("\n")
  return (
    <Tooltip
      multiline
      openDelay={200}
      label={
        short_message
          ? truncString(short_message, 500) +
            (short_message.length > 500 ? "..." : "")
          : " --- "
      }
      position="right"
      styles={{
        tooltip: {
          whiteSpace: "pre-wrap",
        },
      }}
      withArrow
      withinPortal
    >
      <NavLink
        disabled={disabled}
        onClick={() => onChange?.(value)}
        styles={(theme) => ({
          root: {
            borderRadius: 2,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor:
              value?.date && dayjs(value?.date).isToday()
                ? theme.colors.yellow[7] + "88"
                : "transparent",
          },
          description: {
            whiteSpace: "pre-wrap",
          },
        })}
        icon={
          value && (
            <Indicator
              position="bottom-end"
              disabled={value?.orders?.length === 0}
              label={value?.orders?.length}
              size={18}
              color="indigo"
              styles={{
                indicator: {
                  textAlign: "center",
                  lineHeight: 1.55,
                },
              }}
            >
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
            </Indicator>
          )
        }
        label={value ? value.subject && truncString(value.subject, 40) : "⸺"}
        description={
          (value?.from ?? "") +
          (value?.date
            ? "\n" + dayjs(value?.date).format("LT L").toString()
            : "")
        }
        active={active}
      />
    </Tooltip>
  )
}

export default EmailMessageListItem
