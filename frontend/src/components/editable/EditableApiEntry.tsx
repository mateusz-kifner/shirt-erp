import {
  ActionIcon,
  Box,
  Button,
  Group,
  Input,
  Menu,
  Modal,
  Text,
  Tooltip,
} from "@mantine/core"
import { useClipboard, useId } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { CSSProperties, useEffect, useMemo, useState } from "react"
import { SxRadius } from "../../styles/basic"
import {
  IconCopy,
  IconDots,
  IconExternalLink,
  IconQuestionMark,
  IconTrashX,
} from "@tabler/icons-react"
import ApiList from "../api/ApiList"
import { useRouter } from "next/router"
import Link from "next/link"
import { isEqual } from "lodash"
import { useTranslation } from "../../i18n"
import EditableInput from "../../types/EditableInput"

interface EditableApiEntryProps extends EditableInput<any> {
  entryName: string
  Element: React.ElementType
  copyProvider?: (value: any | null) => string | undefined
  style?: CSSProperties
  withErase?: boolean
  listProps?: any
  linkEntry?: boolean
  helpTooltip?: string
  allowClear?: boolean
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
    style,
    withErase = false,
    listProps,
    linkEntry = false,
    helpTooltip,
    allowClear = false,
  } = props

  const [apiEntry, setApiEntry] = useState<any>(value ?? initialValue ?? null)
  const [prev, setPrev] = useState<any>(apiEntry)
  const [opened, setOpened] = useState<boolean>(false)
  const uuid = useId()
  const clipboard = useClipboard()
  // eslint-disable-next-line
  const copyValue = useMemo(() => copyProvider(apiEntry), [apiEntry])
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    setApiEntry(value)
    setPrev(value)
  }, [value])

  useEffect(() => {
    if (isEqual(apiEntry, prev)) return
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
                  <IconCopy size={16} />
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
                    <IconQuestionMark size={16} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          </Group>
        ) : undefined
      }
      labelElement="div"
      required={required}
      // style={{ position: "relative" }}
      styles={{ label: { width: "100%" } }}
      style={style}
    >
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          allowClear ? (
            <Button
              onClick={() => {
                setOpened(false)
                onSubmit?.(null)
              }}
              color="red"
              variant="subtle"
              size="sm"
              leftIcon={<IconTrashX />}
              radius="xl"
            >
              {t("clear")}
            </Button>
          ) : undefined
        }
      >
        {entryName ? (
          <ApiList
            entryName={entryName ?? ""}
            ListItem={Element}
            label={label}
            onChange={(value) => {
              setOpened(false)
              setApiEntry(value)
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
            SxRadius,
            (theme) => ({
              position: "relative",
              border: "1px solid transparent",
              "&:hover": {
                border:
                  theme.colorScheme === "dark"
                    ? "1px solid #2C2E33"
                    : "1px solid #ced4da",
              },
              overflow: "hidden",
            }),
          ]}
        >
          <Element
            onChange={() => setOpened(true)}
            value={apiEntry}
            disabled={disabled}
          />
          {linkEntry && value?.id && (
            <Box
              sx={[
                (theme) => ({
                  position: "absolute",
                  top: "50%",
                  right: "-3rem",
                  transform: "translate(0,-50%)",
                }),
              ]}
            >
              <Link href={"/erp/" + entryName + "/" + value.id} passHref>
                <ActionIcon
                  size={100}
                  component="a"
                  tabIndex={-1}
                  radius={99999}
                  sx={(theme) => ({
                    background:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[7]
                        : theme.white,
                  })}
                >
                  <IconExternalLink size={18} />
                  <div style={{ width: "2.4rem" }}></div>
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
                  <IconDots size={14} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  color="red"
                  icon={<IconTrashX size={14} />}
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
            //   <IconTrashX size={18} />
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
