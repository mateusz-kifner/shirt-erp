import { ActionIcon, Box } from "@mantine/core"
import { useClickOutside } from "@mantine/hooks"
import RichTextEditor, { Editor } from "@mantine/rte"
import DOMPurify from "dompurify"
import { FC, useEffect, useRef, useState } from "react"
import { SxBorder, SxRadius } from "../../styles/basic"
import preventLeave from "../../utils/preventLeave"
import { Notes } from "../../utils/TablerIcons"

interface EditableSecretTextProps {
  value?: string
  initialValue?: string
  onSubmit?: (value: string | null) => void
  disabled?: boolean
  maxLength?: number
}

const EditableSecretText: FC<EditableSecretTextProps> = ({
  value,
  initialValue,

  onSubmit,
  disabled,
  maxLength,
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
    <div>
      {active && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            height: 400,
            width: "100%",
            zIndex: 10,
            overflowY: "auto",
          }}
          ref={ref}
        >
          {disabled ? (
            <Box
              sx={[
                (theme) => ({
                  width: "100%",

                  fontSize: theme.fontSizes.sm,
                  minHeight: 36,
                  wordBreak: "break-word",
                  whiteSpace: "pre-line",
                  padding: "1px 16px",
                  paddingRight: 32,
                  backgroundColor: active
                    ? theme.colorScheme === "dark"
                      ? theme.colors.dark[6]
                      : theme.colors.gray[0]
                    : "transparent",
                  height: 400,
                  overflowY: "auto",
                }),
                SxBorder,
                SxRadius,
              ]}
              dangerouslySetInnerHTML={{ __html: text ? text : "⸺" }}
            ></Box>
          ) : (
            <RichTextEditor
              ref={richTextEditorRef}
              value={text}
              onChange={setText}
              readOnly={!active}
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
              style={{ minHeight: 400 }}
            />
          )}
        </div>
      )}
      {!active && (
        <ActionIcon
          radius="xl"
          sx={[
            (theme) => ({
              position: "absolute",
              right: -12,
              bottom: -12,
              zIndex: 10,

              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.colors.gray[0],
            }),
            SxBorder,
          ]}
          onClick={() => setActive(true)}
        >
          <Notes size={18} />
        </ActionIcon>
      )}
    </div>
  )
}

export default EditableSecretText
