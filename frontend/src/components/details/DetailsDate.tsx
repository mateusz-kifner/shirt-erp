import {
  ActionIcon,
  InputWrapper,
  Text,
  Textarea,
  useMantineTheme,
} from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { useClickOutside, useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { FC, useEffect, useState } from "react"
import preventLeave from "../../utils/preventLeave"
import { Copy, Calendar, TrashX } from "../../utils/TablerIcons"
import dayjs from "dayjs"

interface DetailsDateProps {
  label?: string
  value?: string
  initialValue?: Date
  onChange?: (value: Date | null) => void
  onSubmit?: (value: Date | null) => void
  disabled?: boolean
  required?: boolean
  maxLength?: number
}

const DetailsDate: FC<DetailsDateProps> = ({
  label,
  value,
  initialValue,
  onChange,
  onSubmit,
  disabled,
  required,
  maxLength,
}) => {
  const [date, setDate] = useState<Date | null>(
    value ? new Date(value) : initialValue ? new Date(initialValue) : null
  )
  const [prevDate, setPrevDate] = useState<Date | null>(date)
  const [active, setActive] = useState<boolean>(false)
  const clipboard = useClipboard()
  const dateRef = useClickOutside(() => setActive(false))
  const theme = useMantineTheme()

  useEffect(() => {
    if (active) {
      window.addEventListener("beforeunload", preventLeave)
      dateRef.current &&
        (dateRef.current.selectionStart = dateRef.current.value.length)
      dateRef.current && dateRef.current.focus()
    } else {
      if (date !== prevDate) {
        onSubmit && onSubmit(date)
        setPrevDate(date)
      }
      window.removeEventListener("beforeunload", preventLeave)
    }
  }, [active])

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", preventLeave)
    }
  }, [])

  useEffect(() => {
    const new_value = value ? new Date(value) : new Date()
    setDate(new_value)
    setPrevDate(new_value)
  }, [value])

  const onChangeDate = (date: Date | null) => {
    setDate(date)
    onChange && onChange(date)
  }

  // const onKeyDownDate = (e: React.KeyboardEvent<any>) => {
  //   if (active) {
  //     if (e.code == "Enter" && !e.shiftKey) {
  //       setActive(false)
  //       e.preventDefault()
  //     }
  //     if (e.code == "Escape") {
  //       setDate(prevDate)
  //       setActive(false)
  //       e.preventDefault()
  //     }
  //   } else {
  //     if (e.code == "Enter") {
  //       !disabled && setActive(true)
  //       e.preventDefault()
  //     }
  //   }
  // }

  return (
    <InputWrapper
      label={
        <>
          {label}
          {date && (
            <ActionIcon
              size="xs"
              style={{
                display: "inline-block",
                transform: "translate(4px, 4px)",
                marginRight: 4,
              }}
              onClick={() => {
                const dateString = dayjs(date).format("L").toString()
                clipboard.copy(dateString)
                showNotification({
                  title: "Skopiowano do schowka",
                  message: dateString,
                })
              }}
              tabIndex={-1}
            >
              <Copy size={16} />
            </ActionIcon>
          )}
        </>
      }
      labelElement="div"
      required={required}
    >
      <div style={{ position: "relative" }}>
        <DatePicker
          ref={dateRef}
          onChange={onChangeDate}
          value={date}
          variant={active ? "filled" : "default"}
          onDropdownOpen={() => setActive(true)}
          onDropdownClose={() => setActive(false)}
          icon={<Calendar size={18} />}
          clearable={false}
          styles={(theme) => ({
            input: { padding: "1px 16px", lineHeight: 1.55, height: 44 },
            defaultVariant: {
              backgroundColor: active ? "initial" : "transparent",
            },
          })}
          dayStyle={(date) => ({
            backgroundColor: dayjs(date).isToday()
              ? theme.colors[theme.primaryColor][6] + "33"
              : undefined,
          })}
        />
        <ActionIcon
          radius="xl"
          style={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
          onClick={() => setDate(null)}
          disabled={disabled}
          tabIndex={-1}
        >
          <TrashX size={18} />
        </ActionIcon>
      </div>
    </InputWrapper>
  )
}

export default DetailsDate
