import { ActionIcon, Button, Group, InputWrapper, Stack } from "@mantine/core"
import { FC, useState } from "react"
import { TrashX } from "../../utils/TablerIcons"
import DetailsText from "./DetailsText"

interface DetailsArrayTextProps {
  label?: string
  value?: string[] | null
  initialValue?: string[] | null
  onSubmit?: (value: string[] | null) => void
  disabled?: boolean
  required?: boolean
  maxCount?: number
}

const DetailsArrayText: FC<DetailsArrayTextProps> = (props) => {
  const {
    label,
    value,
    initialValue,

    onSubmit,
    disabled,
    required,
    maxCount,
  } = props
  const [stringArray, setStringArray] = useState<string[]>(
    value ? value : initialValue ? initialValue : []
  )

  return (
    <InputWrapper label={label}>
      <Stack
        sx={(theme) => ({
          border:
            theme.colorScheme === "dark"
              ? "1px solid #2C2E33"
              : "1px solid #ced4da",
          borderRadius: theme.radius.sm,
          padding: theme.spacing.sm,
        })}
      >
        {stringArray.map((val, index) => {
          return (
            <Group spacing="xs">
              <DetailsText
                value={val}
                style={{ flexGrow: 1 }}
                onSubmit={(stringValue) =>
                  stringValue &&
                  setStringArray((stringArrayOld) =>
                    stringArrayOld.map((val, i) =>
                      i === index ? stringValue : val
                    )
                  )
                }
              />
              <ActionIcon color="red" radius="xl">
                <TrashX
                  size={18}
                  onClick={() => {
                    console.log(index)
                    setStringArray((val) => {
                      val.map((val) => {
                        console.log(val)
                      })
                      return val.filter((_, i) => i !== index)
                    })
                  }}
                />
              </ActionIcon>
            </Group>
          )
        })}
        <Button
          variant="outline"
          onClick={() => setStringArray((val) => [...val, ""])}
          disabled={disabled}
        >
          +
        </Button>
      </Stack>
    </InputWrapper>
  )
}

export default DetailsArrayText
