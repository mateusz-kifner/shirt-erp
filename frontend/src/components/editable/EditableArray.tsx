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
import {
  ArrowDown,
  ArrowUp,
  Dots,
  Edit,
  GripVertical,
  Plus,
  TrashX,
  X,
} from "tabler-icons-react"
import { useHover, useListState } from "@mantine/hooks"
import { omit } from "lodash"
import EditableInput from "../../types/EditableInput"

// fixme submit only on edit end

interface EditableArrayProps
  extends Omit<EditableInput<any[]>, "value" | "initialValue"> {
  value?: any[] | null
  initialValue?: any[] | null
  maxCount?: number
  Element: ComponentType<any>
  elementProps: any
  organizingHandle: "none" | "arrows" | "drag and drop"
  linkEntry: boolean
}

const EditableArray = (props: EditableArrayProps) => {
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
    organizingHandle = "none",
    linkEntry = false,
  } = props
  const [items, handlers] = useListState<any>(value ?? initialValue ?? [])
  const [prev, setPrev] = useState<any[]>(items)
  const [active, setActive] = useState<boolean>(false)
  const uuid = useId()
  const { hovered, ref } = useHover()
  // const [y, setY] = useState(0)
  // const [moveIndex, setMoveIndex] = useState(-1)
  // const [ref2, rect] = useResizeObserver()
  // const [ref3, itemRect] = useResizeObserver()
  // const gap = 16

  // const curRow = clamp(
  //   Math.round(
  //     ((moveIndex - 0.5) * (itemRect.height + gap) + y) /
  //       (itemRect.height + gap)
  //   ),
  //   0,
  //   items.length - 1
  // )
  // const bind = useDrag((state) => {
  //   const [originalIndex] = state.args
  //   const [, y] = state.movement
  //   setMoveIndex(originalIndex)
  //   // index =2
  //   const minY = -originalIndex * (itemRect.height + gap)
  //   const maxY = (items.length - originalIndex - 1) * (itemRect.height + gap)
  //   const curRow = clamp(
  //     Math.round(
  //       (originalIndex * (itemRect.height + gap) + y) / (itemRect.height + gap)
  //     ),
  //     0,
  //     items.length - 1
  //   )

  // if (curRow !== originalIndex) {
  //   handlers.reorder({ from: originalIndex, to: curRow })
  // }

  //   console.log(clamp(y, minY, maxY), y, minY, maxY, curRow)

  //   setY(clamp(y, minY, maxY))
  // })

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

  return (
    <Input.Wrapper
      label={label}
      required={required}
      ref={ref}
      sx={(theme) => ({
        touchAction: "none",
        "& *": {
          touchAction: "none",
        },
      })}
    >
      <Stack
        sx={[
          (theme) => ({
            padding: theme.spacing.sm,
            position: "relative",
            minHeight: 44,
            // backgroundColor: active
            //   ? theme.colorScheme === "dark"
            //     ? theme.colors.dark[6]
            //     : theme.colors.gray[0]
            //   : undefined,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: active ? "#1971c2" : "transparent",
            "&:hover": {
              border:
                theme.colorScheme === "dark"
                  ? "1px solid #2C2E33"
                  : "1px solid #ced4da",
            },
          }),
          // SxBorder,
          SxRadius,
        ]}
      >
        <Stack
        // ref={ref2}
        >
          {items.length == 0 && !active && "⸺"}
          {items.map((val, index) => {
            return (
              <Group
                spacing="xs"
                key={uuid + index}
                // style={{
                //   position: "relative",
                //   top:
                //     moveIndex === index
                //       ? y
                //       : index > curRow
                //       ? itemRect.height + 16
                //       : undefined,
                //   zIndex: moveIndex === index ? 102 : undefined,
                // }}
                // ref={index == 0 ? ref3 : undefined}
              >
                <Box
                  sx={(theme) => ({
                    backgroundColor: active
                      ? theme.colorScheme === "dark"
                        ? theme.colors.dark[7]
                        : theme.white
                      : undefined,
                    flexGrow: 1,
                    paddingRight: active ? undefined : 32,
                    borderRadius: theme.radius.sm,
                  })}
                >
                  <Element
                    {...omit(elementProps, ["label"])}
                    value={val}
                    onSubmit={(itemValue: any) => {
                      console.log("array", itemValue)
                      itemValue && handlers.setItem(index, itemValue)
                      // setItems((stringArrayOld) =>
                      //   stringArrayOld.map((val, i) =>
                      //     i === index ? itemValue : val
                      //   )
                      // )
                    }}
                    disabled={!active}
                    linkEntry={linkEntry ? !active : false}
                  />
                </Box>
                {active && (
                  <>
                    {organizingHandle === "arrows" && items.length > 1 && (
                      <>
                        <ActionIcon
                          tabIndex={-1}
                          radius="xl"
                          onClick={() =>
                            handlers.reorder({ from: index, to: index - 1 })
                          }
                          disabled={disabled || index === 0}
                        >
                          <ArrowUp size={14} />
                        </ActionIcon>
                        <ActionIcon
                          tabIndex={-1}
                          radius="xl"
                          onClick={() =>
                            handlers.reorder({ from: index, to: index + 1 })
                          }
                          disabled={disabled || index === items.length - 1}
                        >
                          <ArrowDown size={14} />
                        </ActionIcon>
                      </>
                    )}
                    {organizingHandle === "drag and drop" &&
                      items.length > 1 && (
                        <ActionIcon
                          tabIndex={-1}
                          // {...bind(index)}
                          radius="xl"
                          onClick={() => {}}
                          disabled={disabled}
                          style={{ touchAction: "none" }}
                        >
                          <GripVertical size={14} />
                        </ActionIcon>
                      )}
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
                        <ActionIcon
                          tabIndex={-1}
                          radius="xl"

                          // style={{
                          //   position: "absolute",
                          //   top: "50%",
                          //   right: 8,
                          //   transform: "translate(0,-50%)",
                          // }}
                        >
                          <Dots size={14} />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item
                          icon={<TrashX size={14} />}
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
                  </>
                )}
              </Group>
            )
          })}
        </Stack>
        {active ? (
          <Group>
            <Button
              variant="light"
              onClick={
                () => handlers.append(null)
                //  setItems((val) => [...val, null])
              }
              disabled={
                disabled || (maxCount ? maxCount <= items.length : undefined)
              }
              style={{ flexGrow: 1 }}
            >
              <Plus />
            </Button>

            <ActionIcon
              radius="xl"
              onClick={() => setActive(false)}
              disabled={disabled}
              tabIndex={-1}
            >
              <X size={18} />
            </ActionIcon>
          </Group>
        ) : (
          hovered && (
            <ActionIcon
              radius="xl"
              style={{
                position: "absolute",
                right: 8,
                bottom: 8,
              }}
              onClick={() => setActive(true)}
              disabled={disabled}
              tabIndex={-1}
            >
              <Edit size={18} />
            </ActionIcon>
          )
        )}
      </Stack>
    </Input.Wrapper>
  )
}

export default EditableArray
