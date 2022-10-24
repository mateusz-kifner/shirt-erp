import {
  ActionIcon,
  Group,
  Input,
  TextInput,
  useMantineTheme,
} from "@mantine/core"
import {
  useClickOutside,
  useClipboard,
  useHover,
  useMediaQuery,
  useMergedRef,
} from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import React, { ReactNode, useEffect, useRef, useState } from "react"
import preventLeave from "../../utils/preventLeave"
import { Copy, Edit, X } from "tabler-icons-react"
import DisplayCell from "../details/DisplayCell"
import { number } from "zod"

// FIXME: make DisplayCell accept icon as ReactNode

interface EditableDateProps {
  label?: string
  value?: number
  initialValue?: number
  onSubmit?: (value: number | null) => void
  disabled?: boolean
  required?: boolean
  icon?: ReactNode
  rightSection?: ReactNode
  increment?: number
  fixed?: number
  min?: number
  max?: number
}

const EditableDate = (props: EditableDateProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    icon,
    rightSection,
    increment = 0.01,
    fixed = 2,
    min = Number.MIN_VALUE,
    max = Number.MAX_VALUE,
  } = props
  const [text, setText] = useState<string>(
    value ? value.toString() : initialValue ? initialValue.toString() : "0.00"
  )
  const [prev, setPrev] = useState<string>(text)
  const [lock, setLock] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)
  const clipboard = useClipboard()
  const numberRef = useRef<HTMLInputElement>(null)
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)"
  )

  const { hovered, ref: refHover } = useHover()

  const activate = () => {
    setActive(true)
  }
  const deactivate = () => {
    !lock && setActive(false)
  }

  const ref = useClickOutside(deactivate)
  const mergedRef = useMergedRef(refHover, ref)

  useEffect(() => {
    if (active) {
      window.addEventListener("beforeunload", preventLeave)
    } else {
      if (text !== prev && !isNaN(parseFloat(text))) {
        if (parseFloat(text) > min && parseFloat(text) < max) {
          text && onSubmit && onSubmit(parseFloat(text))
          setPrev(text)
          setText(parseFloat(text).toFixed(fixed))
        } else {
          setText(prev)
        }
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
    const new_value =
      value && !isNaN(value) ? value.toFixed(fixed) : (0.0).toFixed(fixed)
    setText(new_value)
    setPrev(new_value)
  }, [value])

  const onKeyDownDate = (e: React.KeyboardEvent<any>) => {
    if (active) {
      if (e.code == "Enter") {
        deactivate()
        e.preventDefault()
      }
      if (e.code == "Escape") {
        setText(prev)
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
            {text && text.length > 0 && (
              <ActionIcon
                size="xs"
                style={{
                  display: "inline-block",
                  transform: "translate(4px, 4px)",
                  marginRight: 4,
                }}
                onClick={() => {
                  clipboard.copy(text)
                  showNotification({
                    title: "Skopiowano do schowka",
                    message: text,
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
      ref={mergedRef}
    >
      {/* <div > */}
      {active ? (
        <TextInput
          ref={numberRef}
          onChange={(e) => setText(e.target.value)}
          value={text}
          variant={active ? "filled" : "default"}
          icon={icon}
          // clearable={false}
          styles={(theme) => ({
            input: { padding: "1px 16px", lineHeight: 1.55, height: 44 },
            defaultVariant: {
              backgroundColor: active ? "initial" : "transparent",
            },
          })}
          autoFocus
          onKeyDown={onKeyDownDate}
          rightSection={rightSection}
        />
      ) : (
        <DisplayCell icon={icon} rightSection={rightSection}>
          {text ? text : "⸺"}
        </DisplayCell>
      )}

      {!active ? (
        hovered && (
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
        )
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
            onClick={() => {
              setText(prev)
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
    </Input.Wrapper>
  )
}

export default EditableDate
