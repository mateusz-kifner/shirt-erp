import {
  ActionIcon,
  Button,
  InputWrapper,
  Text,
  Textarea,
  TextInput,
  UnstyledButton,
} from "@mantine/core"
import { useClickOutside, useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import React, { FC, useEffect, useState } from "react"
import { Copy, Edit } from "tabler-icons-react"

const alertUser = (e: BeforeUnloadEvent) => {
  e.preventDefault()
  e.returnValue = true
}

interface DetailsTextProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
}

const DetailsText: FC<DetailsTextProps> = ({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  required,
}) => {
  const [val, setVal] = useState<string>()
  const [active, setActive] = useState<boolean>(false)
  const activate = () => {
    setActive(true)
    window.addEventListener("beforeunload", alertUser)
  }

  const deactivate = () => {
    setActive(false)
    window.removeEventListener("beforeunload", alertUser)
  }
  const ref = useClickOutside(deactivate)
  const clipboard = useClipboard()

  useEffect(() => {
    setVal(value)
  }, [value])

  useEffect(() => {
    onChange && val && onChange(val)
  }, [val])

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
      // style={{ position: "relative" }}
    >
      {active ? (
        <Textarea
          // styles={{ input: { lineHeight: "34px" } }}
          ref={ref}
          autosize
          minRows={1}
          value={val}
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
            })}
          >
            {value ? value : "⸺"}
          </Text>
          <ActionIcon
            radius="xl"
            style={{ position: "absolute", right: 4, top: 4 }}
            onClick={activate}
          >
            <Edit />
          </ActionIcon>
        </div>
      )}
    </InputWrapper>
  )
}

export default DetailsText
