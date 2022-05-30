import {
  ActionIcon,
  Group,
  InputWrapper,
  Text,
  useMantineTheme,
} from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { useClickOutside, useClipboard, useMediaQuery } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { FC, useEffect, useRef, useState } from "react"
import preventLeave from "../../utils/preventLeave"
import { Copy, Calendar, TrashX, Edit, X } from "../../utils/TablerIcons"
import dayjs from "dayjs"
import { SxBorder, SxRadius } from "../../styles/basic"
import DisplayCell from "../details/DisplayCell"

interface EditableDateProps {
  label?: string
  value?: string
  initialValue?: string
  onSubmit?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
}

const EditableDate: FC<EditableDateProps> = ({
  label,
  value,
  initialValue,

  onSubmit,
  disabled,
  required,
}) => {
  const [date, setDate] = useState<Date | null>(
    value ? new Date(value) : initialValue ? new Date(initialValue) : null
  )
  const [prev, setPrev] = useState<Date | null>(date)
  const [lock, setLock] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)
  const clipboard = useClipboard()
  const dateRef = useRef<HTMLInputElement>(null)
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
      if (date !== prev) {
        date && onSubmit && onSubmit(date.toISOString())
        setPrev(date)
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
    setPrev(new_value)
  }, [value])

  const onKeyDownDate = (e: React.KeyboardEvent<any>) => {
    if (active) {
      if (e.code == "Enter") {
        deactivate()
        e.preventDefault()
      }
      if (e.code == "Escape") {
        setDate(prev)
        deactivate()
        e.preventDefault()
      }
    }
  }

  return (
    <InputWrapper
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
        ) : undefined
      }
      labelElement="div"
      required={required}
      style={{ position: "relative" }}
      ref={ref}
    >
      {/* <div > */}
      {active ? (
        <DatePicker
          ref={dateRef}
          onChange={setDate}
          value={date}
          variant={active ? "filled" : "default"}
          icon={<Calendar size={18} />}
          clearable={false}
          styles={(theme) => ({
            input: { padding: "1px 16px", lineHeight: 1.55, height: 44 },
            defaultVariant: {
              backgroundColor: active ? "initial" : "transparent",
            },
          })}
          dayStyle={(date, modifiers) => ({
            backgroundColor:
              dayjs(date).isToday() && !modifiers.selected
                ? theme.colors[theme.primaryColor][6] + "33"
                : undefined,
          })}
          allowFreeInput={!isMobile}
          onDropdownOpen={activate}
          onDropdownClose={() => {
            setLock(false)
          }}
          dateParser={(value) => {
            return dayjs(value, "L").toDate()
          }}
          dropdownType={isMobile ? "modal" : "popover"}
          withinPortal={false}
          autoFocus
          onKeyDown={onKeyDownDate}
        />
      ) : (
        <DisplayCell Icon={Calendar}>
          {date ? dayjs(date).format("L").toString() : "⸺"}
        </DisplayCell>
      )}

      {!active ? (
        <ActionIcon
          radius="xl"
          style={{
            position: "absolute",
            right: 8,
            bottom: 8,
          }}
          onClick={activate}
          disabled={disabled}
        >
          <Edit size={18} />
        </ActionIcon>
      ) : (
        <Group
          spacing={0}
          style={{
            position: "absolute",
            right: 8,
            bottom: 8,
          }}
        >
          <ActionIcon
            radius="xl"
            style={{
              width: "auto",
              paddingLeft: 8,
              paddingRight: 8,
            }}
            onClick={() => {
              setDate(new Date())
              deactivate()
            }}
            disabled={disabled}
          >
            Dziś
          </ActionIcon>
          <ActionIcon
            radius="xl"
            onClick={() => {
              setDate(null)
              deactivate()
            }}
            disabled={disabled}
          >
            <TrashX size={18} />
          </ActionIcon>
          <ActionIcon
            radius="xl"
            onClick={() => {
              setDate(prev)
              deactivate()
            }}
            disabled={disabled}
            tabIndex={-1}
          >
            <X size={18} />
          </ActionIcon>
        </Group>
      )}
      {/* </div> */}
    </InputWrapper>
  )
}

export default EditableDate
