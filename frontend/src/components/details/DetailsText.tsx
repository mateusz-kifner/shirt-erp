import { ActionIcon, InputWrapper, Text, Textarea } from "@mantine/core"
import { useClickOutside, useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { FC, useEffect, useState } from "react"
import { Copy, Edit } from "tabler-icons-react"

const alertUser = (e: BeforeUnloadEvent) => {
  e.preventDefault()
  e.returnValue = true
}

interface DetailsTextProps {
  label?: string
  value?: string
  initialValue?: string
  onChange?: (value: string | null) => void
  onSubmit?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
}

const DetailsText: FC<DetailsTextProps> = ({
  label,
  value,
  initialValue,
  onChange,
  onSubmit,
  disabled,
  required,
}) => {
  const [val, setVal] = useState<string>(
    value ? value : initialValue ? initialValue : ""
  )
  const [active, setActive] = useState<boolean>(false)
  const activate = () => {
    setActive(true)
    window.addEventListener("beforeunload", alertUser)
  }

  const deactivate = () => {
    setActive(false)
    val !== value && onSubmit && onSubmit(val)
    window.removeEventListener("beforeunload", alertUser)
  }
  // const ref = useClickOutside(deactivate)
  const clipboard = useClipboard()

  useEffect(() => {
    return () => {
      deactivate()
    }
  }, [])

  useEffect(() => {
    value && setVal(value)
  }, [value])

  const onChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVal(e.target.value)
    onChange && onChange(e.target.value)
  }

  const onKeyDownTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code == "Enter" && !e.shiftKey) {
      deactivate()
    }
  }

  const onFocusTextarea = (
    e: React.FocusEvent<HTMLTextAreaElement, Element>
  ) => {
    e.target.selectionStart = e.target.value.length
  }

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
              marginRight: 4,
            }}
            onClick={() => {
              clipboard.copy(val)
              showNotification({
                title: "Skopiowano do schowka",
                message: val,
              })
            }}
            tabIndex={-1}
          >
            <Copy size={16} />
          </ActionIcon>
        </>
      }
      labelElement="div"
      required={required}
      // style={{ position: "relative" }}
    >
      {active ? (
        <Textarea
          // ref={ref}
          autosize
          autoFocus
          minRows={1}
          value={val}
          onChange={onChangeTextarea}
          onKeyDown={onKeyDownTextarea}
          onFocus={onFocusTextarea}
          onBlur={deactivate}
        />
      ) : (
        <div style={{ position: "relative" }}>
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
          >
            {val ? val : "⸺"}
          </Text>
          <ActionIcon
            radius="xl"
            style={{ position: "absolute", right: 4, top: 4 }}
            onClick={activate}
            disabled={disabled}
          >
            <Edit />
          </ActionIcon>
        </div>
      )}
    </InputWrapper>
  )
}

export default DetailsText
