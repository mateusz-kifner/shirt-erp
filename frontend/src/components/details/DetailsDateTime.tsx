import {
  Group,
  InputWrapper,
  useMantineTheme,
  Text,
  ActionIcon,
} from "@mantine/core"
import { DatePicker, TimeInput } from "@mantine/dates"
import { useClickOutside, useClipboard, useMediaQuery } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import dayjs from "dayjs"
import { FC, useEffect, useRef, useState } from "react"
import { Clock } from "tabler-icons-react"
import preventLeave from "../../utils/preventLeave"
import { Calendar, Copy } from "../../utils/TablerIcons"

// TODO: make it editable

interface DetailsDateTimeProps {
  label?: string
  value?: string
  initialValue?: Date
  onChange?: (value: Date | null) => void
  onSubmit?: (value: Date | null) => void
  disabled?: boolean
  required?: boolean
}

const DetailsDateTime: FC<DetailsDateTimeProps> = (props) => {
  const { label, value, initialValue, onChange, onSubmit, disabled, required } =
    props
  // let new_props = { ...props }
  // delete new_label
  // delete new_onChange
  // delete new_value

  const [date, setDate] = useState<Date | null>(
    value ? new Date(value) : initialValue ? new Date(initialValue) : null
  )
  const [prevDate, setPrevDate] = useState<Date | null>(date)
  const [lock, setLock] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)
  const clipboard = useClipboard()
  const dateRef = useRef<HTMLButtonElement>(null)
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)"
  )
  const activate = () => {
    setActive(true)
  }
  const deactivate = () => {
    !lock && setActive(false)
  }

  const ref = useClickOutside(deactivate)

  useEffect(() => {
    if (active) {
      window.addEventListener("beforeunload", preventLeave)
      // dateRef.current &&(dateRef.current.selectionStart = dateRef.current.value.length)
      // dateRef.current && dateRef.current.focus()
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
    // helper for clear date string
    // const new_date = new Date(dayjs(date).format("YYYY-MM-DD").toString())
    // console.log(new_date)
    setDate(date)
    onChange && onChange(date)
  }

  const onKeyDownDate = (e: React.KeyboardEvent<any>) => {
    if (active) {
      if (e.code == "Enter") {
        deactivate()
        e.preventDefault()
      }
      if (e.code == "Escape") {
        setDate(prevDate)
        deactivate()
        e.preventDefault()
      }
    }
  }

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
                const dateString = dayjs(date).format("L LT").toString()
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
      style={{ position: "relative" }}
      ref={ref}
    >
      {active ? (
        <Group grow>
          <DatePicker
            // {...new_props}
            // placeholder={placeholder ? placeholder : "---"}
            onChange={(val) => {
              val && setDate(val)
            }}
            value={date}
          />
          <TimeInput
            // {...new_props}
            onChange={(val) => {
              val && setDate(val)
            }}
            value={date}
            styles={{
              timeInput: { opacity: 1 },
              input: { opacity: 1 },
              wrapper: { opacity: "1 !important" },
            }}
          />
        </Group>
      ) : (
        <Group
          spacing="xs"
          sx={(theme) => ({
            width: "100%",
            border:
              theme.colorScheme === "dark"
                ? "1px solid #2C2E33"
                : "1px solid #ced4da",
            borderRadius: theme.radius.sm,
            fontSize: theme.fontSizes.sm,
            minHeight: 36,
            wordBreak: "break-word",
            whiteSpace: "pre-line",
            padding: "10px 10px",
            paddingRight: 32,
            lineHeight: 1.55,
            // paddingLeft: 36,
          })}
        >
          <Calendar color="#adb5bd" size={18} />
          {date ? dayjs(date).format("L").toString() : "⸺"}
          <Clock color="#adb5bd" size={18} style={{ marginLeft: 16 }} />
          {date ? dayjs(date).format("LT").toString() : "⸺"}
        </Group>
      )}
    </InputWrapper>
  )
}

export default DetailsDateTime
