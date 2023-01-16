import { ActionIcon, Group, Input, Textarea, Tooltip } from "@mantine/core"
import {
  useClickOutside,
  useClipboard,
  useHover,
  useMergedRef,
} from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { CSSProperties, useRef, useState } from "react"
import { ArrowBackUp, Copy, Edit } from "tabler-icons-react"
import EditableInput from "../../types/EditableInput"
import DisplayCell from "../details/DisplayCell"
import { useTranslation } from "../../i18n"

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
    active,
  } = props
  const clipboard = useClipboard()
  const { t } = useTranslation()

  const [text, setText] = useState(value ?? initialValue ?? "")
  const [prevText, setPrevText] = useState(text)
  const textRef = useRef<HTMLTextAreaElement>(null)

  const clickOutsideRef = useClickOutside(() => {})
  const { hovered, ref } = useHover()
  const { hovered: hovered2, ref: hoveredRef2 } = useHover<HTMLButtonElement>()
  const wrapperRef = useMergedRef(clickOutsideRef, ref)

  const onChangeTextarea = (e: React.ChangeEvent<any>) => {
    setText(e.target.value)
  }

  const onKeyDownTextarea = (e: React.KeyboardEvent<any>) => {
    if (active) {
      if (e.code == "Enter" && !e.shiftKey) {
        // setActive(false)
        e.preventDefault()
      }
      if (e.code == "Escape") {
        setText(prevText)
        // setActive(false)
        e.preventDefault()
      }
    } else {
      if (e.code == "Enter") {
        // !disabled && setActive(true)
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
        ) : undefined
      }
      labelElement="div"
      required={required}
      style={style}
      ref={wrapperRef}
    >
      <div style={{ position: "relative" }}>
        {active ? (
          <Textarea
            ref={textRef}
            autosize
            autoFocus
            minRows={1}
            value={text}
            onChange={onChangeTextarea}
            onKeyDown={onKeyDownTextarea}
            // onBlur={() => setActive(false)}
            // readOnly={!active}
            maxLength={maxLength ?? 255}
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
        ) : (
          <DisplayCell disabled={disabled} hovered={hovered}>
            {text ? text : "⸺"}
          </DisplayCell>
        )}

        {!active ? (
          hovered && (
            <ActionIcon
              // ref={hoveredRef2}
              radius="xl"
              style={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
              onClick={() => {}}
              disabled={disabled}
              tabIndex={-1}
            >
              <Edit size={18} />
            </ActionIcon>
          )
        ) : (
          <Group
            style={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            spacing={4}
          >
            <Tooltip label="Undo" openDelay={500}>
              <ActionIcon
                radius="xl"
                onClick={() => {
                  setText(prevText)
                }}
                disabled={disabled}
                tabIndex={-1}
              >
                <ArrowBackUp size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        )}
      </div>
    </Input.Wrapper>
  )
}

export default EditableText
