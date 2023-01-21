import {
  ActionIcon,
  Box,
  Group,
  Input,
  Paper,
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
import { useEffect, useState, CSSProperties, useRef } from "react"
import preventLeave from "../../utils/preventLeave"
import { ArrowBackUp, ArrowForwardUp, Copy, Edit } from "tabler-icons-react"
import { useTranslation } from "../../i18n"
import EditableInput from "../../types/EditableInput"
import { handleBlurForInnerElements } from "../../utils/handleBlurForInnerElements"
import useDebouncedHistoryState from "../../hooks/useDebouncedHistoryState"

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
    active,
    style,
  } = props

  const [
    text,
    setText,
    debouncedValue,
    { undo, redo, clear, canUndo, canRedo },
  ] = useDebouncedHistoryState<string>(value ?? initialValue ?? "")
  const [focus, setFocus] = useState<boolean>(false)
  const clipboard = useClipboard()
  const textRef = useRef<HTMLTextAreaElement>(null)
  const clickOutsideRef = useClickOutside(() => {})
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
      // if (text !== prevText) {
      //   onSubmit && onSubmit(text)
      //   setPrevText(text)
      // }
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
    // setPrevText(new_value)
  }, [value])

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
        // setText(prevText)
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
      onFocus={() => setFocus(true)}
      onBlur={handleBlurForInnerElements(() => setFocus(false))}
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
          readOnly={!(active && focus)}
          maxLength={maxLength ?? 255}
          styles={(theme) => ({
            input: {
              paddingRight: 40,
              backgroundColor:
                active && focus
                  ? theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0]
                  : "transparent",
              border:
                (active && focus) || hovered
                  ? theme.colorScheme === "dark"
                    ? "1px solid #2C2E33"
                    : "1px solid #ced4da"
                  : "1px solid transparent",

              outline: "none",
              "&:focus": {
                outline: "none",

                borderColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[4],
              },
              fontSize: "inherit",
            },
          })}
        />

        {active && focus && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 16,
              zIndex: 1,
            }}
          >
            <Box
              sx={(theme) => ({
                position: "absolute",
                top: -2,
                left: "50%",
                zIndex: 1,
                width: 8,
                height: 8,
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],

                border:
                  theme.colorScheme === "dark"
                    ? `1px solid ${theme.colors.dark[4]}`
                    : `1px solid ${theme.colors.gray[0]}`,
                borderLeft: "none",
                borderBottom: "none",
                transformOrigin: "bottom left",
                transform: "rotate(-45deg)",
                borderRadius: 1,
              })}
            ></Box>
            <Paper
              withBorder
              radius="md"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
              })}
            >
              <Group p={4} spacing={4}>
                <ActionIcon
                  onClick={() => undo()}
                  radius="md"
                  disabled={!canUndo}
                >
                  <ArrowBackUp />
                </ActionIcon>

                <ActionIcon
                  onClick={() => redo()}
                  radius="md"
                  disabled={!canRedo}
                >
                  <ArrowForwardUp />
                </ActionIcon>
              </Group>
            </Paper>
          </div>
        )}
      </div>
    </Input.Wrapper>
  )
}

export default EditableText
