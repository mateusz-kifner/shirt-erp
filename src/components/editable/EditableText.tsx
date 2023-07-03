import { ActionIcon, Input, Textarea } from "@mantine/core"
import { useClipboard, useHover } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useEffect, useState, CSSProperties, useRef } from "react"
import preventLeave from "../../utils/preventLeave"
import { IconCopy } from "@tabler/icons-react"
import { useTranslation } from "../../i18n"
import EditableInput from "../../types/EditableInput"
import { handleBlurForInnerElements } from "../../utils/handleBlurForInnerElements"

interface EditableTextProps extends EditableInput<string> {
  maxLength?: number
  style?: CSSProperties
}

const EditableText = (props: EditableTextProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    maxLength,
    style,
    leftSection,
    rightSection,
  } = props
  const [text, setText] = useState<string>(value ?? initialValue ?? "")
  const [focus, setFocus] = useState<boolean>(false)
  const clipboard = useClipboard()
  const textRef = useRef<HTMLTextAreaElement>(null)
  const { hovered, ref } = useHover()
  const { t } = useTranslation()
  useEffect(() => {
    if (focus) {
      window.addEventListener("beforeunload", preventLeave)
      textRef.current &&
        (textRef.current.selectionStart = textRef.current.value.length)
      textRef.current && textRef.current.focus()
    } else {
      if (text !== (value ?? "")) {
        onSubmit?.(text)
      }
      window.removeEventListener("beforeunload", preventLeave)
    }
    // eslint-disable-next-line
  }, [focus])

  useEffect(() => {
    return () => {
      if (text !== (value ?? "")) {
        onSubmit?.(text)
      }
      window.removeEventListener("beforeunload", preventLeave)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const new_value = value ?? ""
    setText(new_value)
  }, [value])

  const onChangeTextarea = (e: React.ChangeEvent<any>) => {
    setText(e.target.value)
  }

  const onKeyDownTextarea = (e: React.KeyboardEvent<any>) => {
    if (focus) {
      if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault()
        setFocus(false)
      }
    }
  }

  return (
    <Input.Wrapper
      label={
        label && label.length > 0 ? (
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
                <IconCopy size={16} />
              </ActionIcon>
            )}
          </>
        ) : undefined
      }
      labelElement="div"
      required={required}
      style={style}
      ref={ref}
      onClick={() => !disabled && setFocus(true)}
      onFocus={() => !disabled && setFocus(true)}
      onBlur={handleBlurForInnerElements(() => setFocus(false))}
    >
      <div style={{ position: "relative" }}>
        <Textarea
          ref={textRef}
          rightSection={rightSection}
          icon={leftSection}
          autosize
          minRows={1}
          value={text}
          onChange={onChangeTextarea}
          onKeyDown={onKeyDownTextarea}
          readOnly={!focus}
          maxLength={maxLength ?? 255}
          // placeholder="⸺"
          // disabled={disabled}
          styles={(theme) => ({
            input: {
              paddingRight: 40,
              backgroundColor: focus
                ? theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0]
                : "transparent",
              border:
                focus || hovered || text.length === 0
                  ? theme.colorScheme === "dark"
                    ? "1px solid #2C2E33"
                    : "1px solid #ced4da"
                  : "1px solid transparent",

              "&:focus": {
                borderColor: focus
                  ? undefined
                  : theme.colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[4],
              },
              fontSize: "inherit",
            },
          })}
        />
      </div>
    </Input.Wrapper>
  )
}

export default EditableText
