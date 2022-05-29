import {
  ActionIcon,
  Button,
  Group,
  InputWrapper,
  Menu,
  Stack,
} from "@mantine/core"
import { useUuid } from "@mantine/hooks"
import _ from "lodash"
import { FC, useEffect, useState } from "react"
import { Plus, TrashX } from "../../utils/TablerIcons"

var isArrayEqual = function (x: any, y: any) {
  return _(x).xorWith(y, _.isEqual).isEmpty()
}

interface DetailsArrayProps {
  label?: string
  value?: any[] | null
  initialValue?: any[] | null
  onSubmit?: (value: any[] | null) => void
  disabled?: boolean
  required?: boolean
  maxCount?: number
  Element: React.ComponentType
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
  const [prev, setPrev] = useState<any[]>(items)
  const uuid = useUuid()

  useEffect(() => {
    if (!isArrayEqual(items, prev)) {
      onSubmit && onSubmit(items)
      console.log(items, prev)
    }
  }, [items])

  useEffect(() => {
    if (value) {
      setItems(value)
      setPrev(value)
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
              <Element
                value={val}
                style={{ flexGrow: 1 }}
                onSubmit={(itemValue: any) =>
                  itemValue &&
                  setItems((stringArrayOld) =>
                    stringArrayOld.map((val, i) =>
                      i === index ? itemValue : val
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
