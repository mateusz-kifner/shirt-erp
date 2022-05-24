import { ActionIcon, InputWrapper, Text, Textarea } from "@mantine/core"
import { useClickOutside, useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { FC, useEffect, useRef, useState } from "react"
import preventLeave from "../../utils/preventLeave"
import { Copy, Edit, X } from "../../utils/TablerIcons"

interface DetailsTextProps {
  label?: string
  value?: string
  initialValue?: string
  onChange?: (value: string | null) => void
  onSubmit?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
  maxLength?: number
}

const DetailsText: FC<DetailsTextProps> = ({
  label,
  value,
  initialValue,
  onChange,
  onSubmit,
  disabled,
  required,
  maxLength,
}) => {
  const [text, setText] = useState(
    value ? value : initialValue ? initialValue : ""
  )
  const [prevText, setPrevText] = useState(text)
  const [active, setActive] = useState<boolean>(false)
  const clipboard = useClipboard()
  const textRef = useClickOutside(() => setActive(false))

  useEffect(() => {
    if (active) {
      window.addEventListener("beforeunload", preventLeave)
      textRef.current &&
        (textRef.current.selectionStart = textRef.current.value.length)
      textRef.current && textRef.current.focus()
    } else {
      if (text !== prevText) {
        onSubmit && onSubmit(text)
        setPrevText(text)
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
    const new_value = value ? value : ""
    setText(new_value)
    setPrevText(new_value)
  }, [value])

  const onChangeTextarea = (e: React.ChangeEvent<any>) => {
    setText(e.target.value)
    onChange && onChange(e.target.value)
  }

  const onKeyDownTextarea = (e: React.KeyboardEvent<any>) => {
    if (active) {
      if (e.code == "Enter" && !e.shiftKey) {
        setActive(false)
        e.preventDefault()
      }
      if (e.code == "Escape") {
        setText(prevText)
        setActive(false)
        e.preventDefault()
      }
    } else {
      if (e.code == "Enter") {
        !disabled && setActive(true)
        e.preventDefault()
      }
    }
  }

  return (
    <InputWrapper
      label={
        <>
          {label}
          {text.length > 0 && (
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
      }
      labelElement="div"
      required={required}
    >
      <div style={{ position: "relative" }}>
        <Textarea
          ref={textRef}
          autosize
          autoFocus
          minRows={1}
          value={text}
          onChange={onChangeTextarea}
          onKeyDown={onKeyDownTextarea}
          readOnly={!active}
          maxLength={maxLength ? maxLength : 255}
          styles={(theme) => ({
            input: {
              paddingRight: 40,
              backgroundColor: active
                ? theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0]
                : "transparent",

              border:
                theme.colorScheme === "dark"
                  ? "1px solid #2C2E33"
                  : "1px solid #ced4da",
            },
          })}
        />

        {!active ? (
          <ActionIcon
            radius="xl"
            style={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            onClick={() => setActive(true)}
            disabled={disabled}
            tabIndex={-1}
          >
            <Edit />
          </ActionIcon>
        ) : (
          <ActionIcon
            radius="xl"
            style={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            onClick={() => () => setActive(false)}
            disabled={disabled}
            tabIndex={-1}
          >
            <X />
          </ActionIcon>
        )}
      </div>
    </InputWrapper>
  )
}

export default DetailsText
