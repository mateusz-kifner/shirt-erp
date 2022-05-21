import { ActionIcon, InputWrapper } from "@mantine/core"
import { useClickOutside, useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import RichTextEditor from "@mantine/rte"
import { FC, useEffect, useState, lazy } from "react"
import { Copy, Edit } from "tabler-icons-react"

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
    <InputWrapper
      label={
        <>
          {label}
          <ActionIcon
            size="xs"
            style={{
              display: "inline-block",
              transform: "translate(4px, 4px)",
            }}
            onClick={() => {
              clipboard.copy(val)
              showNotification({
                title: "Skopiowano do schowka",
                message: val,
              })
            }}
          >
            <Copy size={16} />
          </ActionIcon>
        </>
      }
      labelElement="div"
      required={required}
    >
      <div
        //  ref={ref}
        style={{ position: "relative" }}
      >
        <RichTextEditor
          value={val}
          onChange={setValue}
          readOnly={!active}
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
          stickyOffset={60}
        />
        {!active && (
          <ActionIcon
            radius="xl"
            style={{ position: "absolute", right: 4, top: 4 }}
            onClick={activate}
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
