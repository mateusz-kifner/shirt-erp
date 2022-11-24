import { ActionIcon, Box, Paper } from "@mantine/core"
import { useClickOutside } from "@mantine/hooks"
import DOMPurify from "dompurify"
import { useEffect, useRef, useState } from "react"
import { SxBorder, SxRadius } from "../../styles/basic"
import preventLeave from "../../utils/preventLeave"
import { Notes } from "tabler-icons-react"
import { RichTextEditor, Link } from "@mantine/tiptap"
import { useEditor } from "@tiptap/react"
import Highlight from "@tiptap/extension-highlight"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Superscript from "@tiptap/extension-superscript"
import SubScript from "@tiptap/extension-subscript"
interface EditableSecretTextProps {
  value?: string
  initialValue?: string
  onSubmit?: (value: string | null) => void
  disabled?: boolean
  maxLength?: number
}

const EditableSecretText = ({
  value,
  initialValue,

  onSubmit,
  disabled,
  maxLength,
}: EditableSecretTextProps) => {
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
  const ref = useClickOutside(() => setActive(false))

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
    <>
      {active && (
        <div
          className="erase_on_print"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            height: 400,
            width: "100%",
            zIndex: 10,
            overflowY: "auto",
            boxShadow:
              "rgba(0, 0, 0, 0.05) 0px 1px 3px, rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
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
              dangerouslySetInnerHTML={{ __html: text }}
            ></Box>
          ) : (
            // <RichText
            //   ref={richTextEditorRef}
            //   value={text}
            //   onChange={setText}
            //   readOnly={!active}
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
            //   style={{ minHeight: 400 }}
            // />
            <Paper>
              <RichTextEditor
                editor={editor}
                styles={{ root: { minHeight: 400 } }}
              >
                <RichTextEditor.Toolbar sticky>
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
            </Paper>
          )}
        </div>
      )}
      {!active && (
        <ActionIcon
          className="erase_on_print"
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
    </>
  )
}

export default EditableSecretText
