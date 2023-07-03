import {
  ActionIcon,
  Box,
  Button,
  Group,
  Input,
  Menu,
  Stack,
} from "@mantine/core"
import { ComponentType, useEffect, useId, useState } from "react"
import { SxRadius } from "../../styles/basic"
import isArrayEqual from "../../utils/isArrayEqual"
import { useHover, useListState } from "@mantine/hooks"
import { omit } from "lodash"
import EditableInput from "../../types/EditableInput"
import { IconDots, IconPlus, IconTrashX } from "@tabler/icons-react"

// fixme submit only on edit end

interface EditableArrayProps
  extends Omit<EditableInput<any[]>, "value" | "initialValue"> {
  value?: any[] | null
  initialValue?: any[] | null
  newItemValue?: any
  maxCount?: number
  Element: ComponentType<any>
  elementProps: any
  organizingHandle: "none" | "arrows" | "drag and drop"
  linkEntry: boolean
  unique: boolean
}

const EditableArray = (props: EditableArrayProps) => {
  const {
    label,
    value,
    initialValue,
    newItemValue,
    onSubmit,
    disabled,
    required,
    maxCount,
    Element,
    elementProps,
    organizingHandle = "none",
    linkEntry = false,
    unique = true,
  } = props
  const [items, handlers] = useListState<any>(value ?? initialValue ?? [])
  const [prev, setPrev] = useState<any[]>(items)
  const uuid = useId()
  const { hovered, ref } = useHover()

  useEffect(() => {
    const filtered_items = items.filter((val) => !!val)
    if (
      isArrayEqual(
        filtered_items,
        prev.filter((val) => !!val)
      )
    )
      return
    onSubmit?.(filtered_items)
    // eslint-disable-next-line
  }, [items])

  useEffect(() => {
    if (value === undefined || value === null) return
    handlers.setState(value)
    setPrev(value)
    // eslint-disable-next-line
  }, [value])

  // useEffect(() => {
  //   // console.log("items append")
  //   if (
  //     active &&
  //     (items.length === 0 || (items.length && !!items[items.length - 1]))
  //   ) {
  //     handlers.append(null)
  //   }
  //   // console.log(
  //   //   items.some((item) => !item),
  //   //   items
  //   // )
  //   if (!active && items.some((item) => !item)) {
  //     handlers.filter((val) => !!val)
  //     console.log("items filter")
  //   }
  //   // console.log("items active")
  // }, [items, active])

  return (
    <Input.Wrapper
      label={label}
      required={required}
      ref={ref}
      // sx={(theme) => ({ // style for touch reorder
      //   touchAction: "none",
      //   "& *": {
      //     touchAction: "none",
      //   },
      // })}
    >
      <Stack
        sx={[
          (theme) => ({
            // padding: theme.spacing.sm,
            position: "relative",
            minHeight: 44,

            // borderWidth: 1,
            // borderStyle: "solid",
            // borderColor: active ? "#1971c2" : "transparent",
            // "&:hover": {
            //   border:
            //     theme.colorScheme === "dark"
            //       ? "1px solid #2C2E33"
            //       : "1px solid #ced4da",
            // },
          }),
          // SxBorder,
          // SxRadius,
        ]}
      >
        <Stack
          // ref={ref2}
          mt="sm"
          mb="xl"
        >
          {items.length == 0 && "⸺"}
          {items.map((val, index) => {
            return (
              <Group spacing="xs" key={uuid + index}>
                <Box
                  sx={(theme) => ({
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[7]
                        : theme.white,
                    flexGrow: 1,
                    // paddingRight: active ? undefined : 32,
                    borderRadius: theme.radius.sm,
                  })}
                >
                  <Element
                    {...omit(elementProps, ["label"])}
                    value={val}
                    onSubmit={(itemValue: any) => {
                      handlers.setItem(index, itemValue)
                    }}
                    disabled={disabled}
                    linkEntry={linkEntry}
                  />
                </Box>
                {!disabled && (
                  <Menu
                    withArrow
                    styles={(theme) => ({
                      dropdown: {
                        backgroundColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[7]
                            : theme.white,
                      },
                      arrow: {
                        backgroundColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[7]
                            : theme.white,
                      },
                    })}
                    position="bottom-end"
                    arrowOffset={10}
                    offset={2}
                  >
                    <Menu.Target>
                      <ActionIcon tabIndex={-1} radius="xl">
                        <IconDots size={14} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        icon={<IconTrashX size={14} />}
                        onClick={() => {
                          console.log(index)
                          handlers.remove(index)
                          // setItems((val) => val.filter((_, i) => i !== index))
                        }}
                        color="red"
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
              </Group>
            )
          })}
        </Stack>

        {!disabled && (
          <Button
            variant="light"
            onClick={
              () => handlers.append(null)
              //  setItems((val) => [...val, null])
            }
            disabled={maxCount ? maxCount <= items.length : undefined}
            style={{ flexGrow: 1 }}
          >
            <IconPlus />
          </Button>
        )}
      </Stack>
    </Input.Wrapper>
  )
}

export default EditableArray
