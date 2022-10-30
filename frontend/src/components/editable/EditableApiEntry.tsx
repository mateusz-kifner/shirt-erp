import {
  ActionIcon,
  Box,
  CSSObject,
  Group,
  Input,
  Menu,
  Modal,
  Text,
  Tooltip,
} from "@mantine/core"
import { useClipboard, useId } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import _ from "lodash"
import { CSSProperties, useEffect, useMemo, useState } from "react"
import { SxBorder, SxRadius } from "../../styles/basic"
import {
  Copy,
  Dots,
  ExternalLink,
  QuestionMark,
  TrashX,
} from "tabler-icons-react"
import ApiList from "../api/ApiList"
import { useRouter } from "next/router"
import Link from "next/link"

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
  linkEntry: boolean
  helpTooltip?: string
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
    linkEntry = false,
    helpTooltip,
  } = props

  const [apiEntry, setApiEntry] = useState<any>(value ?? initialValue ?? null)
  const [prev, setPrev] = useState<any>(apiEntry)
  const [opened, setOpened] = useState<boolean>(false)
  const uuid = useId()
  const clipboard = useClipboard()
  // eslint-disable-next-line
  const copyValue = useMemo(() => copyProvider(apiEntry), [apiEntry])
  const router = useRouter()

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
          <Group position="apart" spacing={0} style={{ width: "100%" }}>
            <Group spacing={0}>
              {label}
              {apiEntry && copyValue && (
                <ActionIcon
                  size="xs"
                  style={{
                    display: "inline-block",
                    transform: "translate(4px,0)",
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

              {helpTooltip && (
                <Tooltip
                  label={helpTooltip}
                  openDelay={1000}
                  multiline
                  width={220}
                >
                  <ActionIcon variant="transparent" tabIndex={-1}>
                    <QuestionMark size={16} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
            {linkEntry && value?.id && (
              <Link href={"/erp/" + entryName + "/" + value.id} passHref>
                <ActionIcon size="xs" component="a" tabIndex={-1}>
                  <ExternalLink />
                </ActionIcon>
              </Link>
            )}
          </Group>
        ) : undefined
      }
      labelElement="div"
      required={required}
      // style={{ position: "relative" }}
      styles={{ ...styles, label: { ...styles?.label, width: "100%" } }}
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
            onChange={() => setOpened(true)}
            value={apiEntry}
            disabled={disabled}
          />
          {(!label || label.length === 0) && linkEntry && value?.id && (
            <Box
              sx={(theme) => ({
                position: "absolute",
                top: "50%",
                right: theme.spacing.sm,
                transform: "translate(0,-50%)",
              })}
            >
              <Link href={"/erp/" + entryName + "/" + value.id} passHref>
                <ActionIcon size="md" component="a" tabIndex={-1} radius="xl">
                  <ExternalLink size={16} />
                </ActionIcon>
              </Link>
            </Box>
          )}
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
