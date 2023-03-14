import { Input } from "@mantine/core"
import EditableInput from "../../types/EditableInput"
import { FileType } from "../../types/FileType"
import {
  Group,
  MantineTheme,
  Modal,
  useMantineTheme,
  Text,
  Stack,
  Image,
  Menu,
} from "@mantine/core"
import { Dropzone } from "@mantine/dropzone"
import axios, { AxiosError } from "axios"
import { useEffect, useId, useState } from "react"
import { IconPhoto, IconUpload, IconX, IconTrashX } from "@tabler/icons-react"
import { env } from "../../env/client.mjs"
import TablerIconType from "../../types/TablerIconType"
import { SxRadius } from "../../styles/basic"
import FileListItem from "../FileListItem"
import { useTranslation } from "../../i18n"
import { useClickOutside, useHover } from "@mantine/hooks"

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
    return <IconUpload {...props} />
  }

  if (status.rejected) {
    return <IconX {...props} />
  }

  return <IconPhoto {...props} />
}

interface EditableFilesProps extends EditableInput<FileType[]> {
  maxCount?: number
}

const EditableFiles = (props: EditableFilesProps) => {
  const {
    label,
    required,
    onSubmit,
    value,
    initialValue,
    disabled,
    maxCount = 128,
  } = props
  const { t } = useTranslation()
  const theme = useMantineTheme()
  const uuid = useId()
  const [focus, setFocus] = useState<boolean>(false)
  const [files, setFiles] = useState<FileType[]>(value ?? initialValue ?? [])
  const [error, setError] = useState<string | undefined>()
  const [uploading, setUploading] = useState<number>(0)
  const [previewOpened, setPreviewOpened] = useState<boolean>(false)
  const [preview, setPreview] = useState<string>("")
  const [previewWidth, setPreviewWidth] = useState<number | null | undefined>(
    null
  )
  const refClickOutside = useClickOutside(() => setFocus(false))
  const { hovered, ref: hoverdRef } = useHover()

  const onUploadMany = (new_files: File[]) => {
    if (!new_files) return
    if (files.length + new_files.length > maxCount) {
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
        onSubmit?.([...files, ...filesData])
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
          onSubmit?.(files.filter((file) => file.id !== res.data.id))
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

  return (
    <Input.Wrapper
      label={label && label.length > 0 ? label : undefined}
      required={required}
      onClick={() => !disabled && setFocus(true)}
      onFocus={() => !disabled && setFocus(true)}
      ref={refClickOutside}
    >
      <div tabIndex={100000}>
        <Modal
          opened={previewOpened}
          onClose={() => setPreviewOpened(false)}
          styles={{
            body: { maxWidth: "80vw", width: previewWidth ?? undefined },
          }}
        >
          <Image src={preview} alt="" />
        </Modal>

        <Stack
          ref={hoverdRef}
          pt="md"
          pb="xl"
          // p={files.length > 0 || active ? "md" : "xs"}
          // sx={[
          //   (theme) => ({
          //     width: "100%",
          //     position: "relative",
          //     minHeight: 44,
          //     border: "1px solid transparent",
          //     "&:hover": {
          //       border:
          //         theme.colorScheme === "dark"
          //           ? "1px solid #2C2E33"
          //           : "1px solid #ced4da",
          //     },
          //   }),
          //   // SxBorder,
          //   SxRadius,
          // ]}
        >
          {files.length > 0
            ? files.map((file, index) => (
                <Group
                  // pr={active ? undefined : 32}
                  key={uuid + "_" + file.id + "_" + file.name}
                  style={{ position: "relative" }}
                >
                  <FileListItem
                    value={file}
                    onPreview={(url, width) => {
                      setPreview(url)
                      setPreviewWidth(width)
                      setPreviewOpened(true)
                    }}
                    style={{ flexGrow: 1 }}
                    menuNode={
                      !disabled && (
                        <Menu
                          styles={(theme) => ({
                            dropdown: {
                              // marginTop: 4,
                              // marginLeft: -8,
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
                          position="bottom-start"
                          offset={4}
                          opened={true}
                        >
                          <Menu.Dropdown>
                            <Menu.Item
                              icon={<IconTrashX size={14} />}
                              onClick={() => {
                                file.id && onDelete(file.id)
                              }}
                              color="red"
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      )
                    }
                  />
                </Group>
              ))
            : !uploading && <Text>⸺</Text>}
          {error && <Text color="red">{error}</Text>}
          {/* {(active && focus) ||
            (!!uploading && (
              //   ? (files.length < maxFileCount || !!uploading) &&
              //     !disabled && (
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
              >
                {uploading ? (
                  <Group align="center" position="center">
                    <Loader />
                    <Text>
                      {t("uploading")} {uploading}{" "}
                      {uploading === 1
                        ? t("files.singular")
                        : t("files.plural")}
                    </Text>
                  </Group>
                ) : (
                  <Plus size={26} />
                )}
              </Button>
            ))} */}
          {focus && (
            <Dropzone
              onDrop={(files) => {
                onUploadMany(files)
              }}
              onReject={(file_error) => {
                console.log(file_error)
              }}
              style={{ minWidth: "100%" }}
              multiple={maxCount !== 1}
            >
              <Group
                position="center"
                spacing="xl"
                style={{ minHeight: 66, pointerEvents: "none" }}
              >
                <ImageUploadIcon
                  status={status}
                  style={{ color: getIconColor(status, theme) }}
                  size={42}
                />
                <div>
                  <Text size="lg" inline>
                    Wrzuć tu pliki do wysłania
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}
        </Stack>
      </div>
    </Input.Wrapper>
  )
}

export default EditableFiles
