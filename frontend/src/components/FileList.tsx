import {
  Group,
  MantineTheme,
  Modal,
  useMantineTheme,
  Text,
  Stack,
  Image,
  Button,
  LoadingOverlay,
} from "@mantine/core"
import { Dropzone } from "@mantine/dropzone"
import axios, { AxiosError } from "axios"
import { useId, useState } from "react"
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
  const [prev, setPrev] = useState<FileType[]>(files)
  const [error, setError] = useState<string | undefined>()
  const [uploading, setUploading] = useState<number>(0)
  const [dropOpened, setDropOpened] = useState<boolean>(false)
  const [previewOpened, setPreviewOpened] = useState<boolean>(false)
  const [preview, setPreview] = useState<string>("")

  const onUpload = (file: File) => {
    if (!file) return
    setUploading((num: number) => num + 1)

    const formData = new FormData()
    formData.append("files", file)

    console.log(formData.getAll("files"))

    axios
      .post(env.NEXT_PUBLIC_SERVER_API_URL + "/api/upload", formData)
      .then((res: any) => {
        const fileData = res.data.data[0]

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
      .delete(
        env.NEXT_PUBLIC_SERVER_API_URL + `/api/upload/files/${files[index]?.id}`
      )
      .then((value) => {
        console.log(value)
      })
      .catch((err: AxiosError) => {
        setError(err.response?.statusText)
        console.log({ ...err })
      })
    setFiles((files) => files.filter((_, i) => i !== index))
  }

  // useEffect(() => {
  //   if (!filesData || filesData.length === 0) return
  //   const files = filesData.map((val: FilesDataType) => {
  //     if (typeof val?.file?.token !== "string") {
  //       let res = axios.get("upload/token/" + val?.file?.id).catch(() => {})
  //     }
  //     return val.file
  //   })
  //   if (isArrayEqual(files, prev)) return
  //   onChange?.(files)
  //   // eslint-disable-next-line
  // }, [filesData])

  // useEffect(() => {
  //   if (value === undefined || value === null) return
  //   setFilesData(value.map((val) => ({ file: val, preview: null })))
  // }, [value])

  return (
    <>
      <Modal opened={previewOpened} onClose={() => setPreviewOpened(false)}>
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
            // setError(file_error[0].errors[0].message)
          }}
          style={{ minWidth: "100%" }}
          multiple={maxFileCount !== 1}
        >
          {/* {(status) => ( */}
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
            <Text color="red">{error}</Text>
          </Group>
          {/* )} */}
        </Dropzone>
      </Modal>
      <Stack
        p="md"
        sx={[
          (theme) => ({
            width: "100%",

            backgroundColor: theme.colorScheme === "dark" ? "#2C2E33" : "#fff",
          }),
          SxBorder,
          SxRadius,
        ]}
      >
        {files.map((file, index) => (
          <FileListItem
            value={file}
            onPreview={(url) => {
              setPreview(url)
              setPreviewOpened(true)
            }}
            onDelete={onDelete}
          />
        ))}
        {(files.length < maxFileCount || !!uploading) && !disabled && (
          <Button
            variant="default"
            styles={(theme) => ({
              root: {
                height: 100,
                width: 100,
                backgroundColor:
                  theme.colorScheme === "dark" ? "#1A1B1E" : "#fff",
              },
            })}
            onClick={() => setDropOpened(true)}
            radius="md"
            // disabled={disabled || !!uploading}
          >
            {uploading ? <LoadingOverlay visible={true} /> : <Plus size={32} />}
          </Button>
        )}
      </Stack>
    </>
  )
}

export default FileList
