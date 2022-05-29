import {
  ActionIcon,
  Box,
  Button,
  Group,
  InputWrapper,
  Menu,
  Stack,
} from "@mantine/core"
import { useUuid } from "@mantine/hooks"
import _ from "lodash"
import { FC, useEffect, useState } from "react"
import isArrayEqual from "../../utils/isArrayEqual"
import { Plus, TrashX } from "../../utils/TablerIcons"

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
    if (isArrayEqual(items, prev)) return
    onSubmit && onSubmit(items)
    console.log(items, prev)
  }, [items])

  useEffect(() => {
    if (value === undefined || value === null) return
    setItems(value)
    setPrev(value)
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
              <div style={{ flexGrow: 1 }}>
                <Element
                  value={val}
                  onSubmit={(itemValue: any) => {
                    console.log("array", itemValue)
                    itemValue &&
                      setItems((stringArrayOld) =>
                        stringArrayOld.map((val, i) =>
                          i === index ? itemValue : val
                        )
                      )
                  }}
                  {...elementProps}
                />
              </div>
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
          onClick={() => setItems((val) => [...val, null])}
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
