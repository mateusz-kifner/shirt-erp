import { Group, Input, useMantineTheme, Text, ActionIcon } from "@mantine/core"
import { useClickOutside, useClipboard, useMediaQuery } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import dayjs from "dayjs"
import { useEffect, useRef, useState } from "react"
import { SxBorder, SxRadius } from "../../styles/basic"
import preventLeave from "../../utils/preventLeave"
import { IconCalendar, IconClock, IconCopy } from "@tabler/icons-react"
import EditableInput from "../../types/EditableInput"

// TODO: make it editable

interface EditableDateTimeProps extends EditableInput<string> {}

const EditableDateTime = (props: EditableDateTimeProps) => {
  const { label, value, initialValue, onSubmit, disabled, required } = props
  // let new_props = { ...props }
  // delete new_label
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
        onSubmit && onSubmit(date?.toISOString() ?? null)
        setPrevDate(date)
      }
      window.removeEventListener("beforeunload", preventLeave)
    }
    // eslint-disable-next-line
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
    <Input.Wrapper
      label={
        label && label.length > 0 ? (
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
                <IconCopy size={16} />
              </ActionIcon>
            )}
          </>
        ) : undefined
      }
      labelElement="div"
      required={required}
      style={{ position: "relative" }}
      ref={ref}
    >
      {active ? (
        <Group grow>{/* TODO */}</Group>
      ) : (
        <Group
          spacing="xs"
          sx={[
            (theme) => ({
              width: "100%",

              fontSize: theme.fontSizes.sm,
              minHeight: 36,
              wordBreak: "break-word",
              whiteSpace: "pre-line",
              padding: "10px 10px",
              paddingRight: 32,
              lineHeight: 1.55,
              // paddingLeft: 36,
              border: "1px solid transparent",
            }),
            // SxBorder,
            SxRadius,
          ]}
        >
          <IconCalendar color="#adb5bd" size={18} />
          {date ? dayjs(date).format("L").toString() : "⸺"}
          <IconClock color="#adb5bd" size={18} style={{ marginLeft: 16 }} />
          {date ? dayjs(date).format("LT").toString() : "⸺"}
        </Group>
      )}
    </Input.Wrapper>
  )
}

export default EditableDateTime
