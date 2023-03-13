import { ActionIcon, Box, Input, TypographyStylesProvider } from "@mantine/core"
import {
  useClickOutside,
  useClipboard,
  useHover,
  useMergedRef,
} from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useEffect, useState } from "react"
import preventLeave from "../../utils/preventLeave"
import { IconCopy } from "@tabler/icons-react"
import DOMPurify from "dompurify"
import TurndownService from "turndown"
import { SxRadius } from "../../styles/basic"
import { RichTextEditor, Link } from "@mantine/tiptap"
import { useEditor } from "@tiptap/react"
import Highlight from "@tiptap/extension-highlight"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Superscript from "@tiptap/extension-superscript"
import SubScript from "@tiptap/extension-subscript"
import EditableInput from "../../types/EditableInput"

const turndownService = new TurndownService()

interface EditableRichTextProps extends EditableInput<string> {}

const EditableRichText = ({
  label,
  value,
  initialValue,
  onSubmit,
  disabled,
  required,
}: EditableRichTextProps) => {
  const [text, setText] = useState<string>(
    value
      ? DOMPurify.sanitize(value)
      : initialValue
      ? DOMPurify.sanitize(initialValue)
      : ""
  )

  const [focus, setFocus] = useState<boolean>(false)
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

    content: text,
    onUpdate: ({ editor }) => {
      setText(editor.getHTML())
    },
  })
  const clickOutsideRef = useClickOutside(() => setFocus(false))
  // const richTextEditorRef = useRef<Editor>(null)
  const clipboard = useClipboard()
  const { hovered, ref: hoverRef } = useHover()
  const mergedRef = useMergedRef(clickOutsideRef, hoverRef)

  useEffect(() => {
    if (focus) {
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
      if (text != value && text != "") {
        onSubmit?.(text)
      }
      window.removeEventListener("beforeunload", preventLeave)
    }
    // eslint-disable-next-line
  }, [focus])

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", preventLeave)
    }
  }, [])

  useEffect(() => {
    if (value) {
      const cleanValue = DOMPurify.sanitize(value)
      setText(cleanValue)
    }
  }, [value])

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
                <IconCopy size={16} />
              </ActionIcon>
            )}
          </>
        ) : undefined
      }
      labelElement="div"
      required={required}
      ref={mergedRef}
      onClick={() => !disabled && setFocus(true)}
      onFocus={() => !disabled && setFocus(true)}
      // onBlur={handleBlurForInnerElements(() => setFocus(false))}
    >
      {focus ? (
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky tabIndex={999999999}>
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
            {/* disabled because of bug in peer deps*/}
            {/* <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup> */}
            {/* disabled due to focus loss */}
            {/* <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup> */}

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
        <TypographyStylesProvider>
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
                lineHeight: text.trimStart().startsWith("<") ? undefined : 1.55,
                border: hovered
                  ? disabled
                    ? "1px solid transparent"
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
        </TypographyStylesProvider>
      )}
    </Input.Wrapper>
  )
}

export default EditableRichText
