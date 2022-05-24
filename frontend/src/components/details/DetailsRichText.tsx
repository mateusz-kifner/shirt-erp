import { ActionIcon, Box, InputWrapper } from "@mantine/core"
import { useClickOutside, useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import RichTextEditor, { Editor } from "@mantine/rte"
import { FC, useEffect, useState, useRef } from "react"
import preventLeave from "../../utils/preventLeave"
import { Copy, Edit } from "../../utils/TablerIcons"
import DOMPurify from "dompurify"

interface DetailsRichTextProps {
  label?: string
  value?: string
  initialValue?: string
  onChange?: (value: string | null) => void
  onSubmit?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
}

const DetailsRichText: FC<DetailsRichTextProps> = ({
  label,
  value,
  initialValue,
  onChange,
  onSubmit,
  disabled,
  required,
}) => {
  const [text, setText] = useState(
    value
      ? DOMPurify.sanitize(value)
      : initialValue
      ? DOMPurify.sanitize(initialValue)
      : ""
  )
  const [prevText, setPrevText] = useState(text)
  const [active, setActive] = useState<boolean>(false)
  const richTextEditorRef = useRef<Editor>(null)
  const ref = useClickOutside(() => setActive(false))
  const clipboard = useClipboard()

  useEffect(() => {
    if (active) {
      window.addEventListener("beforeunload", preventLeave)
      setTimeout(() => {
        richTextEditorRef.current?.editor?.focus()
        richTextEditorRef.current?.editor?.setSelection(
          richTextEditorRef.current?.editor?.getLength(),
          0
        )
      })
    } else {
      if (text !== value) {
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
    if (value) {
      const cleanValue = DOMPurify.sanitize(value)
      setText(cleanValue)
      setPrevText(cleanValue)
    }
  }, [value])

  const onChangeTextarea = (value: string) => {
    setText(value)
    onChange && onChange(value)
  }

  const onKeyDownTextarea = (e: React.KeyboardEvent<any>) => {
    if (active) {
      if (e.code == "Enter" && e.ctrlKey) {
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
        setActive(true)
        e.preventDefault()
      }
    }
  }

  return (
    <InputWrapper
      label={
        <>
          {label}
          {text.length > 0 && text !== "<p><br></p>" && (
            <ActionIcon
              size="xs"
              style={{
                display: "inline-block",
                transform: "translate(4px, 4px)",
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
      <div ref={ref} style={{ position: "relative" }}>
        {active ? (
          <RichTextEditor
            ref={richTextEditorRef}
            value={text}
            onChange={onChangeTextarea}
            readOnly={false}
            controls={[
              ["bold", "italic", "underline", "strike", "clean"],
              ["h1", "h2", "h3", "h4"],
              ["unorderedList", "orderedList"],
              ["sup", "sub"],
              ["alignLeft", "alignCenter", "alignRight"],
              ["link", "blockquote", "codeBlock"],
            ]}
            onKeyDown={onKeyDownTextarea}
            sticky={true}
            stickyOffset={60}
            sx={(theme) => ({
              backgroundColor: active
                ? theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0]
                : "transparent",
            })}
          />
        ) : (
          <>
            <Box
              sx={(theme) => ({
                width: "100%",
                border:
                  theme.colorScheme === "dark"
                    ? "1px solid #2C2E33"
                    : "1px solid #ced4da",
                borderRadius: theme.radius.sm,
                fontSize: theme.fontSizes.sm,
                minHeight: 36,
                wordBreak: "break-word",
                whiteSpace: "pre-line",
                padding: "1px 16px",
                paddingRight: 32,
              })}
              dangerouslySetInnerHTML={{ __html: text ? text : "⸺" }}
            ></Box>
            <ActionIcon
              radius="xl"
              style={{ position: "absolute", right: 8, top: 8 }}
              onClick={() => setActive(true)}
              disabled={disabled}
            >
              <Edit />
            </ActionIcon>
          </>
        )}
      </div>
    </InputWrapper>
  )
}

export default DetailsRichText
