import { ActionIcon, Box, Input, TypographyStylesProvider } from "@mantine/core"
import { useClickOutside, useClipboard, useHover } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useEffect, useState, useRef } from "react"
import preventLeave from "../../utils/preventLeave"
import { Copy, Edit } from "tabler-icons-react"
import DOMPurify from "dompurify"
import TurndownService from "turndown"
import { SxBorder, SxRadius } from "../../styles/basic"
import { RichTextEditor, Link } from "@mantine/tiptap"
import { useEditor } from "@tiptap/react"
import Highlight from "@tiptap/extension-highlight"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Superscript from "@tiptap/extension-superscript"
import SubScript from "@tiptap/extension-subscript"
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
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    autofocus: "start",

    content: text,
    onUpdate: ({ editor }) => {
      setText(editor.getHTML())
    },
  })
  // const richTextEditorRef = useRef<Editor>(null)
  const ref = useClickOutside(() => setActive(false))
  const clipboard = useClipboard()
  const { hovered, ref: refHover } = useHover()

  useEffect(() => {
    if (active) {
      window.addEventListener("beforeunload", preventLeave)
      // setTimeout(() => {
      //   richTextEditorRef.current?.editor?.focus()
      //   richTextEditorRef.current?.editor?.setSelection(
      //     richTextEditorRef.current?.editor?.getLength(),
      //     0
      //   )
      // })
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
                  const plainText = unescape(
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
          // <RichText
          //   ref={richTextEditorRef}
          //   value={text}
          //   onChange={setText}
          //   readOnly={false}
          //   controls={[
          //     ["bold", "italic", "underline", "strike", "clean"],
          //     ["h1", "h2", "h3", "h4"],
          //     ["unorderedList", "orderedList"],
          //     ["sup", "sub"],
          //     ["alignLeft", "alignCenter", "alignRight"],
          //     ["link", "blockquote", "codeBlock"],
          //   ]}
          //   onKeyDown={onKeyDownTextarea}
          //   sticky={true}
          //   stickyOffset={60}
          //   sx={(theme) => ({
          //     backgroundColor: active
          //       ? theme.colorScheme === "dark"
          //         ? theme.colors.dark[6]
          //         : theme.colors.gray[0]
          //       : "transparent",
          //   })}
          // />
          <RichTextEditor
            editor={editor}
            onChange={(event) => console.log(event)}
          >
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>
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
                  border: hovered
                    ? disabled
                      ? undefined
                      : theme.colorScheme === "dark"
                      ? "1px solid #2C2E33"
                      : "1px solid #ced4da"
                    : "1px solid transparent",
                }),
                // SxBorder,
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
