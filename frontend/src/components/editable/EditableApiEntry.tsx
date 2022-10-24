import {
  ActionIcon,
  Box,
  CSSObject,
  Input,
  Menu,
  Modal,
  Text,
} from "@mantine/core"
import { useClipboard, useId } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import _ from "lodash"
import { CSSProperties, FC, useEffect, useMemo, useState } from "react"
import { SxBorder, SxRadius } from "../../styles/basic"
import { Copy, Dots, Menu2, TrashX, X } from "tabler-icons-react"
import ApiList from "../api/ApiList"

interface EditableApiEntryProps {
  label?: string
  value?: any
  initialValue?: any
  onSubmit?: (value: any | null) => void
  disabled?: boolean
  required?: boolean
  entryName: string
  Element: React.ElementType
  copyProvider?: (value: any | null) => string | undefined
  style?: CSSProperties
  styles?: Partial<
    Record<"label" | "required" | "root" | "error" | "description", CSSObject>
  >
  withErase?: boolean
  listProps?: any
}

const EditableApiEntry = (props: EditableApiEntryProps) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    Element,
    entryName,
    copyProvider = () => "",
    styles,
    style,
    withErase = false,
    listProps,
  } = props

  const [apiEntry, setApiEntry] = useState<any>(value ?? initialValue ?? null)
  const [prev, setPrev] = useState<any>(apiEntry)
  const [opened, setOpened] = useState<boolean>(false)
  const uuid = useId()
  const clipboard = useClipboard()
  // eslint-disable-next-line
  const copyValue = useMemo(() => copyProvider(apiEntry), [apiEntry])

  useEffect(() => {
    setApiEntry(value)
    setPrev(value)
  }, [value])

  useEffect(() => {
    if (_.isEqual(apiEntry, prev)) return
    onSubmit?.(apiEntry)
    setPrev(apiEntry)
    // eslint-disable-next-line
  }, [apiEntry])

  return (
    <Input.Wrapper
      label={
        label && label.length > 0 ? (
          <>
            {label}
            {apiEntry && copyValue && (
              <ActionIcon
                size="xs"
                style={{
                  display: "inline-block",
                  transform: "translate(4px, 4px)",
                  marginRight: 4,
                }}
                onClick={() => {
                  clipboard.copy(copyValue)
                  showNotification({
                    title: "Skopiowano do schowka",
                    message: copyValue,
                  })
                }}
                tabIndex={-1}
              >
                <Copy size={16} />
              </ActionIcon>
            )}
          </>
        ) : undefined
      }
      labelElement="div"
      required={required}
      // style={{ position: "relative" }}
      styles={styles}
      style={style}
    >
      <Modal opened={opened} onClose={() => setOpened(false)} title="">
        {entryName ? (
          <ApiList
            entryName={entryName ?? ""}
            ListItem={Element}
            label={label}
            onChange={(value) => {
              setApiEntry(value)
              setOpened(false)
            }}
            {...listProps}
          />
        ) : (
          <Text color="red">
            Entry Name not valid or element was not defined in mapping
          </Text>
        )}
      </Modal>
      {entryName ? (
        <Box
          key={uuid}
          sx={[
            (theme) => ({
              position: "relative",
            }),
            SxBorder,
            SxRadius,
          ]}
        >
          <Element
            onChange={() => {
              setOpened(true)
            }}
            value={apiEntry}
            disabled={disabled}
          />
          {apiEntry && withErase && (
            <Menu withArrow>
              <Menu.Target>
                <ActionIcon
                  tabIndex={-1}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 8,
                    transform: "translate(0,-50%)",
                  }}
                >
                  <Dots size={14} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  color="red"
                  icon={<TrashX size={14} />}
                  onClick={() => setApiEntry(null)}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            // <ActionIcon
            //   style={{
            //     position: "absolute",
            //     top: "50%",
            //     right: 8,
            //     transform: "translate(0,-50%)",
            //   }}
            //   onClick={() => setApiEntry(null)}
            //   radius="xl"
            // >
            //   <TrashX size={18} />
            // </ActionIcon>
          )}
        </Box>
      ) : (
        <Text color="red">
          Entry Name not valid or element was not defined in mapping
        </Text>
      )}
    </Input.Wrapper>
  )
}

export default EditableApiEntry
