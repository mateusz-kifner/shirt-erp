import {
  Group,
  MantineTheme,
  Modal,
  useMantineTheme,
  Text,
  Stack,
  Image,
  Button,
  Loader,
  Menu,
  ActionIcon,
} from "@mantine/core"
import { Dropzone } from "@mantine/dropzone"
import axios, { AxiosError } from "axios"
import { useEffect, useId, useRef, useState } from "react"
import { Photo, Upload, X, Plus, Dots, TrashX, Edit } from "tabler-icons-react"
import { env } from "../env/client.mjs"
import { FileType } from "../types/FileType"
import TablerIconType from "../types/TablerIconType"
import { SxBorder, SxRadius } from "../styles/basic"
import FileListItem from "./FileListItem"
import { handleBlurForInnerElements } from "../utils/handleBlurForInnerElements"
import { useTranslation } from "../i18n"

// FIXME: ENFORCE FILE LIMIT

function getIconColor(status: any, theme: MantineTheme) {
  return status.accepted
    ? //@ts-ignore
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.colors.gray[7]
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIconType> & { status: any }) {
  if (status.accepted) {
    return <Upload {...props} />
  }

  if (status.rejected) {
    return <X {...props} />
  }

  return <Photo {...props} />
}

interface FileListProps {
  onChange?: (files: FileType[] | null) => void
  value?: FileType[] | null
  initialValue?: FileType[] | null
  disabled?: boolean
  maxFileCount?: number
}

const FileList = ({
  onChange,
  value,
  initialValue,
  disabled,
  maxFileCount = 128,
}: FileListProps) => {
  const { t } = useTranslation()
  const theme = useMantineTheme()
  const uuid = useId()
  const [active, setActive] = useState<boolean>(false)
  const [files, setFiles] = useState<FileType[]>(value ?? initialValue ?? [])
  const [error, setError] = useState<string | undefined>()
  const [uploading, setUploading] = useState<number>(0)
  const [dropOpened, setDropOpened] = useState<boolean>(false)
  const [previewOpened, setPreviewOpened] = useState<boolean>(false)
  const [preview, setPreview] = useState<string>("")
  const [previewWidth, setPreviewWidth] = useState<number | null | undefined>(
    null
  )
  const ref = useRef<any>(null)

  const onUploadMany = (new_files: File[]) => {
    if (!new_files) return
    if (files.length + new_files.length > maxFileCount) {
      setError("File limit reached")
      return
    }
    setUploading((num: number) => num + new_files.length)

    const formData = new FormData()

    for (let i = 0; i < new_files.length; i++) {
      formData.append("files", new_files[i])
    }

    // upload file for spec entry
    // formData.append("ref", "api::order.order") // entryName
    // formData.append("refId", "1") // entry id
    // formData.append("field", "files")

    axios
      .post(env.NEXT_PUBLIC_SERVER_API_URL + "/api/upload", formData)
      .then((res: any) => {
        const filesData = res.data
        onChange?.([...files, ...filesData])
        setFiles((files) => [...files, ...filesData])
        setUploading((num: number) => num - new_files.length)
        setError(undefined)
      })
      .catch((err: AxiosError) => {
        setError(err.response?.statusText)
        setUploading((num: number) => num - new_files.length)
      })
  }

  const onDelete = (index: number) => {
    axios
      .delete(env.NEXT_PUBLIC_SERVER_API_URL + `/api/upload/files/${index}`)
      .then((res) => {
        if (res?.data?.id !== undefined) {
          setFiles((files) => files.filter((file) => file.id !== res.data.id))
          onChange?.(files.filter((file) => file.id !== res.data.id))
        }
        setError(undefined)

        //        console.log(res)
      })
      .catch((err: AxiosError) => {
        setFiles((files) => files.filter((val) => val.id !== index))
        setError(err.response?.statusText)
        console.log(err)
      })
  }

  useEffect(() => {
    if (value === undefined || value === null) return
    setFiles(value)
  }, [value])

  const onBlur = handleBlurForInnerElements(() => {
    setActive(false)
  })

  return (
    <div tabIndex={100000} onBlur={onBlur} ref={ref}>
      <Modal
        opened={previewOpened}
        onClose={() => setPreviewOpened(false)}
        styles={{
          modal: {
            maxWidth: "80vw",
            width: previewWidth ?? undefined,
          },
        }}
      >
        <Image src={preview} alt="" />
      </Modal>
      <Modal
        opened={dropOpened}
        onClose={() => setDropOpened(false)}
        styles={{ modal: { width: "70vw" } }}
        centered
      >
        <Dropzone
          onDrop={(files) => {
            onUploadMany(files)
            setDropOpened(false)
          }}
          onReject={(file_error) => {
            console.log(file_error)
          }}
          style={{ minWidth: "100%" }}
          multiple={maxFileCount !== 1}
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 360, pointerEvents: "none" }}
          >
            <ImageUploadIcon
              status={status}
              style={{ color: getIconColor(status, theme) }}
              size={80}
            />
            <div>
              <Text size="xl" inline>
                Wrzuć tu pliki do wysłania
              </Text>
            </div>
          </Group>
        </Dropzone>
      </Modal>

      <Stack
        p={files.length > 0 || active ? "md" : "xs"}
        sx={[
          (theme) => ({
            width: "100%",
            position: "relative",
            minHeight: 44,
          }),
          SxBorder,
          SxRadius,
        ]}
      >
        {files.length > 0
          ? files.map((file, index) => (
              <Group
                pr={active ? undefined : 32}
                key={uuid + "_" + file.id + "_" + file.name}
              >
                <FileListItem
                  value={file}
                  onPreview={(url, width) => {
                    setPreview(url)
                    setPreviewWidth(width)
                    setPreviewOpened(true)
                  }}
                  style={{ flexGrow: 1 }}
                />
                {active && (
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
                        <Dots size={14} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        icon={<TrashX size={14} />}
                        onClick={() => {
                          file.id && onDelete(file.id)
                        }}
                        color="red"
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
              </Group>
            ))
          : !active && !uploading && <Text>⸺</Text>}
        {error && <Text color="red">{error}</Text>}
        {active || !!uploading ? (
          (files.length < maxFileCount || !!uploading) &&
          !disabled && (
            <Button
              variant="default"
              styles={(theme) => ({
                root: {
                  height: 46,
                  width: "100%",
                  backgroundColor:
                    theme.colorScheme === "dark" ? "#1A1B1E" : "#fff",
                  "&:disabled": {
                    color: theme.colorScheme === "dark" ? "#fff" : "#000",
                  },
                },
              })}
              onClick={() => !uploading && setDropOpened(true)}
              radius="sm"
              disabled={disabled || !!uploading}
            >
              {uploading ? (
                <Group align="center" position="center">
                  <Loader />
                  <Text>
                    {t("uploading")} {uploading}{" "}
                    {uploading === 1 ? t("files.singular") : t("files.plural")}
                  </Text>
                </Group>
              ) : (
                <Plus size={26} />
              )}
            </Button>
          )
        ) : (
          <ActionIcon
            radius="xl"
            style={{ position: "absolute", right: 8, bottom: 8 }}
            onClick={() => {
              setActive(true)
              ref.current?.focus?.()
            }}
            disabled={disabled}
          >
            <Edit size={18} />
          </ActionIcon>
        )}
      </Stack>
    </div>
  )
}

export default FileList
