import { ActionIcon, Box, Input, TypographyStylesProvider } from "@mantine/core"
import { useClickOutside, useClipboard, useHover } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import type { Editor } from "@mantine/rte"
import { useEffect, useState, useRef } from "react"
import preventLeave from "../../utils/preventLeave"
import { Copy, Edit } from "tabler-icons-react"
import DOMPurify from "dompurify"
import _ from "lodash"
import TurndownService from "turndown"
import { SxBorder, SxRadius } from "../../styles/basic"
import RichText from "../../lib/mantine/RichText"

const turndownService = new TurndownService()

interface EditableRichTextProps {
  label?: string
  value?: string
  initialValue?: string
  onSubmit?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
}

const EditableRichText = ({
  label,
  value,
  initialValue,

  onSubmit,
  disabled,
  required,
}: EditableRichTextProps) => {
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
  const { hovered, ref: refHover } = useHover()

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
      //prevent excessive updates
      if (text != value && text != "" && value !== undefined) {
        onSubmit?.(text)
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
    <Input.Wrapper
      label={
        label && label.length > 0 ? (
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
                  const plainText = _.unescape(
                    turndownService.turndown(
                      text
                        .replace(/h[0-9]>/g, "div>")
                        .replace(
                          /<\/*(s|em|strong|a|b|i|mark|del|small|ins|sub|sup)>/g,
                          ""
                        )
                    )
                  )
                  clipboard.copy(plainText)
                  showNotification({
                    title: "Skopiowano do schowka",
                    message: plainText,
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
      ref={refHover}
    >
      <div ref={ref} style={{ position: "relative" }}>
        {active ? (
          <RichText
            ref={richTextEditorRef}
            value={text}
            onChange={setText}
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
            {/* <TypographyStylesProvider> */}
            <Box
              sx={[
                (theme) => ({
                  width: "100%",

                  fontSize: theme.fontSizes.sm,
                  minHeight: 36,
                  wordBreak: "break-word",
                  whiteSpace: "pre-line",
                  padding: "10px 16px",
                  paddingRight: 32,
                  lineHeight: text.trimStart().startsWith("<")
                    ? undefined
                    : 1.55,
                }),
                SxBorder,
                SxRadius,
              ]}
              className="plain-html"
              dangerouslySetInnerHTML={{ __html: text || "⸺" }}
            ></Box>
            {/* </TypographyStylesProvider> */}
            {hovered && (
              <ActionIcon
                radius="xl"
                style={{ position: "absolute", right: 8, top: 8 }}
                onClick={() => setActive(true)}
                disabled={disabled}
              >
                <Edit size={18} />
              </ActionIcon>
            )}
          </>
        )}
      </div>
    </Input.Wrapper>
  )
}

export default EditableRichText
