import { ActionIcon, InputWrapper, Select } from "@mantine/core"
import { useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { FC, useEffect, useState } from "react"
import { Copy } from "../../utils/TablerIcons"

interface DetailsEnumProps {
  label?: string
  value?: string
  initialValue?: string
  onSubmit?: (value: string | null) => void
  disabled?: boolean
  required?: boolean
  enum_data: string[]
}

const DetailsEnum: FC<DetailsEnumProps> = ({
  label,
  value,
  initialValue,

  onSubmit,
  disabled,
  required,
  enum_data,
}) => {
  const [data, setData] = useState(
    value ? value : initialValue ? initialValue : ""
  )
  const clipboard = useClipboard()

  useEffect(() => {
    if (value) {
      setData(value)
      // setPrevData(value)
    }
  }, [value])

  const onChangeData = (value: string) => {
    setData(value)
    onSubmit && onSubmit(value)
  }

  return (
    <InputWrapper
      label={
        label && label.length > 0 ? (
          <>
            {label}
            <ActionIcon
              size="xs"
              style={{
                display: "inline-block",
                transform: "translate(4px, 4px)",
              }}
              onClick={() => {
                clipboard.copy(value)
                showNotification({
                  title: "Skopiowano do schowka",
                  message: value,
                })
              }}
              tabIndex={-1}
            >
              <Copy size={16} />
            </ActionIcon>
          </>
        ) : undefined
      }
      labelElement="div"
      required={required}
    >
      <div style={{ position: "relative" }}>
        <Select
          data={enum_data}
          value={data}
          onChange={onChangeData}
          disabled={disabled}
        />
      </div>
    </InputWrapper>
  )
}

export default DetailsEnum
