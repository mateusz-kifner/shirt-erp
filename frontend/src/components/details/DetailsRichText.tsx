import { ActionIcon, InputWrapper, Text } from "@mantine/core"
import { useClickOutside, useClipboard, useLogger } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import RichTextEditor, { Editor } from "@mantine/rte"
import { FC, useEffect, useState, useRef } from "react"
import preventLeave from "../../utils/preventLeave"
import { Copy, Edit } from "../../utils/TablerIcons"
import DOMPurify from "dompurify"

// fix race condition with cancel deactivate

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
  const [text, setTextA] = useState(
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

  const setText = (name_of_node: string) => {
    return (value: any) => {
      console.log("Updated BY", name_of_node, value)
      setTextA(value)
    }
  }

  useEffect(() => {
    console.log("effect", text, prevText)
    if (active) {
      console.log("activate")
      window.addEventListener("beforeunload", preventLeave)

      setTimeout(() => {
        richTextEditorRef.current?.editor?.focus()
        richTextEditorRef.current?.editor?.setSelection(
          richTextEditorRef.current?.editor?.getLength(),
          0
        )
      })
    } else {
      console.log("deactivate")
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
      setText("UseEffect[value]")(cleanValue ? cleanValue : "")
      setPrevText(cleanValue ? cleanValue : "")
    }
  }, [value])

  const onChangeTextarea = (value: string) => {
    setText("onChangeTextarea")(value)
    onChange && onChange(value)
  }

  const onKeyDownTextarea = (e: React.KeyboardEvent<any>) => {
    console.log("onKEY DDWON")
    if (active) {
      if (e.code == "Enter" && e.ctrlKey) {
        setActive(false)
        e.preventDefault()
      }
      if (e.code == "Escape") {
        console.log(prevText, text)

        setText("onKeyDownTextarea[cancel]")(prevText)
        setTimeout(() => {
          setActive(false)
        }, 1000)

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
          <Text
            sx={(theme) => ({
              width: "100%",
              border:
                theme.colorScheme === "dark"
                  ? "1px solid #2C2E33"
                  : "1px solid #ced4da",
              borderRadius: theme.radius.sm,
              padding: "1px 12px",
              fontSize: theme.fontSizes.sm,
              minHeight: 36,
              lineHeight: "34px",
              paddingRight: 28,
              wordBreak: "break-word",
              whiteSpace: "pre-line",
            })}
            dangerouslySetInnerHTML={{ __html: text ? text : "⸺" }}
          ></Text>
        )}
        {!active && (
          <ActionIcon
            radius="xl"
            style={{ position: "absolute", right: 4, top: 4 }}
            onClick={() => setActive(true)}
            disabled={disabled}
          >
            <Edit />
          </ActionIcon>
        )}
      </div>
    </InputWrapper>
  )
}

export default DetailsRichText
