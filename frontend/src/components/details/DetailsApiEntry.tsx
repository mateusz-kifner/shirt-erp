import {
  ActionIcon,
  Box,
  CSSObject,
  InputWrapper,
  Menu,
  Modal,
  Text,
} from "@mantine/core"
import { useClipboard, useUuid } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import _ from "lodash"
import { CSSProperties, FC, useEffect, useMemo, useState } from "react"
import { SxBorder, SxRadius } from "../../styles/basic"
import { Copy, TrashX, X } from "../../utils/TablerIcons"
import ApiList from "../api/ApiList"

interface DetailsApiEntryProps {
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
}

const DetailsApiEntry: FC<DetailsApiEntryProps> = (props) => {
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
    withErase = true,
  } = props

  const [apiEntry, setApiEntry] = useState<any>(
    value ? value : initialValue ? initialValue : null
  )
  const [prev, setPrev] = useState<any>(apiEntry)
  const [opened, setOpened] = useState<boolean>(false)
  const uuid = useUuid()
  const clipboard = useClipboard()
  const copyValue = useMemo(() => copyProvider(apiEntry), [apiEntry])

  useEffect(() => {
    setApiEntry(value)
    setPrev(value)
  }, [value])

  useEffect(() => {
    if (_.isEqual(apiEntry, prev)) return
    onSubmit && onSubmit(apiEntry)
    setPrev(apiEntry)
  }, [apiEntry])

  return (
    <InputWrapper
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
            entryName={entryName ? entryName : ""}
            ListItem={Element}
            label={label}
            onChange={(value) => {
              setApiEntry(value)
              setOpened(false)
            }}
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
          />
          {apiEntry && withErase && (
            <Menu
              tabIndex={-1}
              withArrow
              sx={{
                position: "absolute",
                top: "50%",
                right: 8,
                transform: "translate(0,-50%)",
              }}
            >
              <Menu.Item
                icon={<TrashX size={14} />}
                onClick={() => setApiEntry(null)}
                color="red"
              >
                Delete
              </Menu.Item>
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
    </InputWrapper>
  )
}

export default DetailsApiEntry
