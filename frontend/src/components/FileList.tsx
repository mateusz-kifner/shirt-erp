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
} from "@mantine/core"
import { Dropzone } from "@mantine/dropzone"
import axios, { AxiosError } from "axios"
import { useEffect, useId, useState } from "react"
import { Photo, Upload, X, Plus } from "tabler-icons-react"
import { env } from "../env/client.mjs"
import { FileType } from "../types/FileType"
import TablerIconType from "../types/TablerIconType"
import { SxBorder, SxRadius } from "../styles/basic"
import FileListItem from "./FileListItem"

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
  maxFileCount = 1024,
}: FileListProps) => {
  const theme = useMantineTheme()
  const uuid = useId()
  const [files, setFiles] = useState<FileType[]>(value ?? initialValue ?? [])
  const [error, setError] = useState<string | undefined>()
  const [uploading, setUploading] = useState<number>(0)
  const [dropOpened, setDropOpened] = useState<boolean>(false)
  const [previewOpened, setPreviewOpened] = useState<boolean>(false)
  const [preview, setPreview] = useState<string>("")
  const [previewWidth, setPreviewWidth] = useState<number | null | undefined>(
    null
  )
  const [previewHeight, setPreviewHeight] = useState<number | null | undefined>(
    null
  )

  const onUpload = (file: File) => {
    if (!file) return
    setUploading((num: number) => num + 1)

    const formData = new FormData()

    formData.append("files", file)

    // upload file for spec entry
    // formData.append("ref", "api::order.order") // entryName
    // formData.append("refId", "1") // entry id
    // formData.append("field", "files")
    console.log(formData.getAll("files"))

    axios
      .post(env.NEXT_PUBLIC_SERVER_API_URL + "/api/upload", formData)
      .then((res: any) => {
        const fileData = res.data[0]
        onChange?.([...files, fileData])
        setFiles((files) => [...files, fileData])
        setUploading((num: number) => num - 1)
      })
      .catch((err: AxiosError) => {
        setError(err.response?.statusText)
        setUploading((num: number) => num - 1)
      })
  }

  const onDelete = (index: number) => {
    axios
      .delete(env.NEXT_PUBLIC_SERVER_API_URL + `/api/upload/files/${index}`)
      .then((res) => {
        if (res?.data?.id !== undefined) {
          setFiles((files) => files.filter((file) => file.id !== res.data.id))
        }
        console.log(res)
      })
      .catch((err: AxiosError) => {
        setError(err.response?.statusText)
        console.log(err)
      })
    setFiles((files) => files.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (value === undefined || value === null) return
    setFiles(value)
  }, [value])

  return (
    <>
      <Modal
        opened={previewOpened}
        onClose={() => setPreviewOpened(false)}
        styles={{
          modal: {
            maxWidth: "80vw",
            width: previewWidth ?? undefined,
            // height: previewHeight ?? undefined,
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
            for (let file of files) onUpload(file)
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
        p="md"
        sx={[
          (theme) => ({
            width: "100%",

            // backgroundColor: theme.colorScheme === "dark" ? "#2C2E33" : "#fff",
          }),
          SxBorder,
          SxRadius,
        ]}
      >
        {files.map((file, index) => (
          <FileListItem
            key={uuid + "_" + file.id + "_" + file.name}
            value={file}
            onPreview={(url, width, height) => {
              setPreview(url)
              setPreviewWidth(width)
              setPreviewHeight(height)
              setPreviewOpened(true)
            }}
          />
        ))}
        {error && <Text color="red">{error}</Text>}
        {(files.length < maxFileCount || !!uploading) && !disabled && (
          <Button
            variant="default"
            styles={(theme) => ({
              root: {
                height: 46,
                width: "100%",
                backgroundColor:
                  theme.colorScheme === "dark" ? "#1A1B1E" : "#fff",
              },
            })}
            onClick={() => !uploading && setDropOpened(true)}
            radius="sm"
            disabled={disabled || !!uploading}
          >
            {uploading ? <Loader /> : <Plus size={26} />}
          </Button>
        )}
      </Stack>
    </>
  )
}

export default FileList
