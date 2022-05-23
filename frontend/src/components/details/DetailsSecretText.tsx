import { ActionIcon } from "@mantine/core"
import { useClickOutside } from "@mantine/hooks"
import RichTextEditor, { Editor } from "@mantine/rte"
import { FC, useEffect, useRef, useState } from "react"
import preventLeave from "../../utils/preventLeave"
import { Notes } from "../../utils/TablerIcons"

// FIXME: make onChange?(or maybe onSubmit) only fire on save

const alertUser = (e: BeforeUnloadEvent) => {
  e.preventDefault()
  e.returnValue = true
}

interface DetailsSecretTextProps {
  value?: string
  initialValue?: string
  onChange?: (value: string | null) => void
  onSubmit?: (value: string | null) => void
  disabled?: boolean
  maxLength?: number
}

const DetailsSecretText: FC<DetailsSecretTextProps> = ({
  value,
  initialValue,
  onChange,
  onSubmit,
  disabled,
  maxLength,
}) => {
  const [text, setText] = useState(
    value ? value : initialValue ? initialValue : ""
  )
  const [prevText, setPrevText] = useState(text)
  const [active, setActive] = useState<boolean>(false)
  const richTextEditorRef = useRef<Editor>(null)
  const ref = useClickOutside(() => deactivate())

  const activate = () => {
    setActive(true)
    window.addEventListener("beforeunload", preventLeave)
    setTimeout(() => {
      richTextEditorRef.current?.editor?.focus()
      richTextEditorRef.current?.editor?.setSelection(
        richTextEditorRef.current?.editor?.getLength(),
        0
      )
    })
  }

  const deactivate = () => {
    setActive(false)
    if (text !== value) {
      setTimeout(() => {
        onSubmit && onSubmit(text)
        setPrevText(text)
      })
    }
    window.removeEventListener("beforeunload", preventLeave)
  }
  const cancel = () => {
    setActive(false)
    setTimeout(() => setText(prevText))

    window.removeEventListener("beforeunload", preventLeave)
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", preventLeave)
    }
  }, [])

  useEffect(() => {
    setText(value ? value : "")
    setPrevText(value ? value : "")
  }, [value])

  const onChangeTextarea = (value: string) => {
    setText(value)
    onChange && onChange(value)
  }

  const onKeyDownTextarea = (e: React.KeyboardEvent<any>) => {
    if (active) {
      if (e.code == "Enter" && e.ctrlKey) {
        deactivate()
        e.preventDefault()
      }
      if (e.code == "Escape") {
        cancel()
        e.preventDefault()
      }
    } else {
      if (e.code == "Enter") {
        activate()
        e.preventDefault()
      }
    }
  }
  return (
    <div>
      <div
        style={{
          position: "absolute",
          display: active ? "block" : "none",
          right: 4,
          bottom: 4,
          height: 400,
          width: "100%",
          zIndex: 10,
          overflowY: "auto",
        }}
        ref={ref}
      >
        <RichTextEditor
          ref={richTextEditorRef}
          value={text}
          onChange={onChangeTextarea}
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
      </div>
      {!active && (
        <ActionIcon
          radius="xl"
          style={{ position: "absolute", right: 0, bottom: -10, zIndex: 10 }}
          onClick={activate}
          disabled={disabled}
        >
          <Notes />
        </ActionIcon>
      )}
    </div>
  )
}

export default DetailsSecretText
