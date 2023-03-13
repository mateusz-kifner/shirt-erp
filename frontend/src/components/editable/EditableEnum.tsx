import { ActionIcon, Input, Select } from "@mantine/core"
import { useClipboard } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useEffect, useState } from "react"
import { IconCopy } from "@tabler/icons-react"
import { useTranslation } from "../../i18n"
import EditableInput from "../../types/EditableInput"

interface EditableEnumProps extends EditableInput<string> {
  enum_data: string[]
}

const EditableEnum = ({
  label,
  value,
  initialValue,
  onSubmit,
  disabled,
  required,
  enum_data,
}: EditableEnumProps) => {
  const [data, setData] = useState(value ?? initialValue ?? "")
  const clipboard = useClipboard()
  const { t } = useTranslation()

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
    <Input.Wrapper
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
              <IconCopy size={16} />
            </ActionIcon>
          </>
        ) : undefined
      }
      labelElement="div"
      required={required}
    >
      <div style={{ position: "relative" }}>
        <Select
          data={enum_data.map((value) => ({ value, label: t(value) }))}
          value={data}
          onChange={onChangeData}
          disabled={disabled}
        />
      </div>
    </Input.Wrapper>
  )
}

export default EditableEnum
