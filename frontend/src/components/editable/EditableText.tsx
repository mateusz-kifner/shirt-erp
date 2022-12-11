import {
  ActionIcon,
  CSSObject,
  Group,
  Input,
  Textarea,
  Tooltip,
} from "@mantine/core"
import {
  useClickOutside,
  useClipboard,
  useHover,
  useMergedRef,
} from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useEffect, useState, CSSProperties, ReactNode, useRef } from "react"
import preventLeave from "../../utils/preventLeave"
import { ArrowBackUp, Copy, DeviceFloppy, Edit, X } from "tabler-icons-react"
import { useTranslation } from "../../i18n"
import DisplayCell from "../details/DisplayCell"
import EditableInput from "../../types/EditableInput"

interface EditableTextProps extends EditableInput<string> {
  maxLength?: number
  style?: CSSProperties
  styles?: Partial<
    Record<"label" | "required" | "root" | "error" | "description", CSSObject>
  >
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
    styles,
  } = props

  const [text, setText] = useState(value ?? initialValue ?? "")
  const [prevText, setPrevText] = useState(text)
  const [active, setActive] = useState<boolean>(false)
  const clipboard = useClipboard()
  const textRef = useRef<HTMLTextAreaElement>(null)
  const clickOutsideRef = useClickOutside(() => setActive(false))
  const { hovered, ref } = useHover()
  const { hovered: hovered2, ref: hoveredRef2 } = useHover<HTMLButtonElement>()
  const { t } = useTranslation()
  const wrapperRef = useMergedRef(clickOutsideRef, ref)

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
    // eslint-disable-next-line
  }, [active])

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", preventLeave)
    }
  }, [])

  useEffect(() => {
    const new_value = value ?? ""
    setText(new_value)
    setPrevText(new_value)
  }, [value])

  const onChangeTextarea = (e: React.ChangeEvent<any>) => {
    setText(e.target.value)
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
      styles={styles}
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
              onClick={() => setActive(true)}
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
                  setTimeout(() => setActive(false))
                }}
                disabled={disabled}
                tabIndex={-1}
              >
                <ArrowBackUp size={18} />
              </ActionIcon>
            </Tooltip>

            {/* <ActionIcon
              radius="xl"
              onClick={() => {
                setTimeout(() => setActive(false))
              }}
              disabled={disabled}
              tabIndex={-1}
            >
              <DeviceFloppy size={18} />
            </ActionIcon> */}
          </Group>
        )}
      </div>
    </Input.Wrapper>
  )
}

export default EditableText
