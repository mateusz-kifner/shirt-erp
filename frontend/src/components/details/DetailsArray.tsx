import {
  ActionIcon,
  Button,
  Group,
  InputWrapper,
  Menu,
  Stack,
} from "@mantine/core"
import { useUuid } from "@mantine/hooks"
import { FC, useEffect, useState } from "react"
import { Plus, TrashX } from "../../utils/TablerIcons"
import DetailsText from "./DetailsText"

interface DetailsArrayProps {
  label?: string
  value?: any[] | null
  initialValue?: any[] | null
  onSubmit?: (value: any[] | null) => void
  disabled?: boolean
  required?: boolean
  maxCount?: number
  Element: React.ReactNode
  elementProps: any
}

const DetailsArray: FC<DetailsArrayProps> = (props) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    maxCount,
    Element,
    elementProps,
  } = props
  const [items, setItems] = useState<any[]>(
    value ? value : initialValue ? initialValue : []
  )
  const uuid = useUuid()

  useEffect(() => {
    onSubmit && onSubmit(items)
  }, [items])

  useEffect(() => {
    if (value) {
      setItems(value)
    }
  }, [value])

  return (
    <InputWrapper label={label} required={required}>
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
        {items.map((val, index) => {
          return (
            <Group spacing="xs" key={uuid + index}>
              <DetailsText
                value={val}
                style={{ flexGrow: 1 }}
                onSubmit={(stringValue) =>
                  stringValue &&
                  setItems((stringArrayOld) =>
                    stringArrayOld.map((val, i) =>
                      i === index ? stringValue : val
                    )
                  )
                }
                {...elementProps}
              />
              <Menu tabIndex={-1} withArrow>
                <Menu.Item
                  icon={<TrashX size={14} />}
                  onClick={() => {
                    console.log(index)
                    setItems((val) => val.filter((_, i) => i !== index))
                  }}
                  color="red"
                >
                  Delete
                </Menu.Item>
              </Menu>
            </Group>
          )
        })}
        <Button
          variant="light"
          onClick={() => setItems((val) => [...val, ""])}
          disabled={
            disabled || (maxCount ? maxCount <= items.length : undefined)
          }
        >
          <Plus />
        </Button>
      </Stack>
    </InputWrapper>
  )
}

export default DetailsArray
