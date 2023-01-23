import { ActionIcon, Box, Group, Input, Paper, Textarea } from "@mantine/core"
import { useClipboard, useHover } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useEffect, useState, CSSProperties, useRef } from "react"
import preventLeave from "../../utils/preventLeave"
import { ArrowBackUp, ArrowForwardUp, Copy } from "tabler-icons-react"
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
    leftSection,
    rightSection,
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
  const { hovered, ref } = useHover()
  const { t } = useTranslation()

  useEffect(() => {
    if (focus) {
      window.addEventListener("beforeunload", preventLeave)
      textRef.current &&
        (textRef.current.selectionStart = textRef.current.value.length)
      textRef.current && textRef.current.focus()
    } else {
      window.removeEventListener("beforeunload", preventLeave)
    }
    // eslint-disable-next-line
  }, [focus])

  useEffect(() => {
    if (debouncedValue !== value) {
      onSubmit?.(debouncedValue)
    }
  }, [debouncedValue])

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
    if (focus) {
      if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault()
      }
      if (e.code === "Escape" || e.code === "Enter") {
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
                <Copy size={16} />
              </ActionIcon>
            )}
          </>
        ) : undefined
      }
      labelElement="div"
      required={required}
      style={style}
      ref={ref}
      onClick={() => setFocus(true)}
      onFocus={() => setFocus(true)}
      onBlur={handleBlurForInnerElements(() => setFocus(false))}
    >
      <div style={{ position: "relative" }}>
        <Textarea
          ref={textRef}
          rightSection={rightSection}
          icon={leftSection}
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

              "&:focus": {
                borderColor:
                  active && focus
                    ? undefined
                    : theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
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
