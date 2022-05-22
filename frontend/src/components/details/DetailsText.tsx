import { ActionIcon, InputWrapper, Text, Textarea } from "@mantine/core"
import { useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { FC, useEffect, useRef, useState } from "react"
import Copy from "tabler-icons-react/dist/icons/copy.js"
import Edit from "tabler-icons-react/dist/icons/edit.js"
import X from "tabler-icons-react/dist/icons/x.js"

const alertUser = (e: BeforeUnloadEvent) => {
  e.preventDefault()
  e.returnValue = true
}

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
  const textRef = useRef<HTMLTextAreaElement>(null)
  const clipboard = useClipboard()

  const activate = () => {
    setActive(true)
    window.addEventListener("beforeunload", alertUser)
    textRef.current &&
      (textRef.current.selectionStart = textRef.current.value.length)
    textRef.current && textRef.current.focus()
  }

  const deactivate = () => {
    setActive(false)
    if (text !== value) {
      onSubmit && onSubmit(text)
      setPrevText(text)
    }
    window.removeEventListener("beforeunload", alertUser)
  }
  const cancel = () => {
    setActive(false)
    setText(prevText)
    window.removeEventListener("beforeunload", alertUser)
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", alertUser)
    }
  }, [])

  useEffect(() => {
    setText(value ? value : "")
    setPrevText(value ? value : "")
  }, [value])

  const onChangeTextarea = (e: React.ChangeEvent<any>) => {
    setText(e.target.value)
    onChange && onChange(e.target.value)
  }

  const onKeyDownTextarea = (e: React.KeyboardEvent<any>) => {
    if (active) {
      if (e.code == "Enter" && !e.shiftKey) {
        deactivate()
        e.preventDefault()
      }
      if (e.code == "Escape") {
        cancel()
        e.preventDefault()
      }
    } else {
      if (e.code == "Enter") {
        activate()
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
          onBlur={deactivate}
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
              "&:focus": {
                border:
                  theme.colorScheme === "dark"
                    ? "1px solid #2C2E33"
                    : "1px solid #ced4da",
                outline: "none",
              },
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
            onClick={activate}
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
            onClick={cancel}
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
