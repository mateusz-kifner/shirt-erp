import { ActionIcon, InputWrapper } from "@mantine/core"
import { useClickOutside, useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import RichTextEditor from "@mantine/rte"
import { FC, useEffect, useState, lazy } from "react"
import { Copy, Edit, Notes } from "tabler-icons-react"

// FIXME: make onChange?(or maybe onSubmit) only fire on save

const alertUser = (e: BeforeUnloadEvent) => {
  e.preventDefault()
  e.returnValue = true
}

interface DetailsRichTextProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
}

const DetailsRichText: FC<DetailsRichTextProps> = ({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  required,
}) => {
  const [val, setVal] = useState<string>(value ? value : "")
  const [active, setActive] = useState<boolean>(false)
  const activate = () => {
    setActive(true)
    window.addEventListener("beforeunload", alertUser)
  }

  const deactivate = () => {
    setActive(false)
    window.removeEventListener("beforeunload", alertUser)
  }
  const ref = useClickOutside(() => deactivate())
  const clipboard = useClipboard()

  useEffect(() => {
    value && setVal(value)
  }, [value])

  const setValue = (newValue: string) => {
    onChange && onChange(newValue)
    setVal(newValue)
  }

  useEffect(() => {
    return () => {
      deactivate()
    }
  }, [])

  return (
    <div>
      <div
        ref={ref}
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
      >
        <RichTextEditor
          value={val}
          onChange={setValue}
          controls={[
            ["bold", "italic", "underline", "strike", "clean"],
            ["h1", "h2", "h3", "h4"],
            ["unorderedList", "orderedList"],
            ["sup", "sub"],
            ["alignLeft", "alignCenter", "alignRight"],
            ["link", "blockquote", "codeBlock"],
          ]}
          onKeyDown={(e) => {
            if (e.code == "Enter" && !e.shiftKey) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          sticky={true}
          style={{ minHeight: 400 }}
        />
      </div>
      {!active && (
        <ActionIcon
          radius="xl"
          style={{ position: "absolute", right: 0, bottom: 0, zIndex: 10 }}
          onClick={activate}
          disabled={disabled}
        >
          <Notes />
        </ActionIcon>
      )}
    </div>
  )
}

export default DetailsRichText
