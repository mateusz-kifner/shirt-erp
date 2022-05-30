import {
  Group,
  MantineTheme,
  Modal,
  useMantineTheme,
  Text,
  Stack,
  Image,
  Button,
  ActionIcon,
  Divider,
  LoadingOverlay,
} from "@mantine/core"
import { Dropzone, DropzoneStatus } from "@mantine/dropzone"
import { useUuid } from "@mantine/hooks"
import axios, { AxiosError } from "axios"
import { FC, useEffect, useState } from "react"
import {
  Photo,
  Upload,
  X,
  Plus,
  FileUnknown,
  TrashX,
  Eye,
} from "../utils/TablerIcons"
import { serverURL } from "../env"
import { FileType } from "../types/FileType"
import TablerIconType from "../types/TablerIconType"
import isArrayEqual from "../utils/isArrayEqual"
import { SxBorder, SxRadius } from "../styles/basic"

// FIXME: ENFORCE FILE LIMIT

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.colors.gray[7]
}

function isFileImage(file: File) {
  return file && file["type"].split("/")[0] === "image"
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIconType> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />
  }

  if (status.rejected) {
    return <X {...props} />
  }

  return <Photo {...props} />
}

function getBase64(file: File | undefined): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file as Blob)
    reader.onload = () => resolve(reader.result as string | null)
    reader.onerror = (error) => reject(error)
  })
}

interface FilesDataType {
  file: FileType
  preview: string | Promise<string | null> | null
}

interface FileListProps {
  onChange?: (files: FileType[] | null) => void
  value?: FileType[] | null
  disabled?: boolean
  maxFileCount?: number
}

const FileList: FC<FileListProps> = ({
  onChange,
  value,
  disabled,
  maxFileCount = 1024,
}) => {
  const theme = useMantineTheme()
  const uuid = useUuid()
  const [filesData, setFilesData] = useState<FilesDataType[]>([])
  const [prev, setPrev] = useState<FileType[]>(filesData.map((val) => val.file))
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
      .post(serverURL + "/api/upload", formData)
      .then((res: any) => {
        const fileData = res.data.data[0]
        console.log(fileData)

        setFilesData((filesDataValue: FilesDataType[]) => [
          ...filesDataValue,
          {
            file: fileData,
            preview: null,
          },
        ])
        setUploading((num: number) => num - 1)

        try {
          isFileImage(file) &&
            getBase64(file).then((preview) => {
              setFilesData((filesDataValue) => [
                ...filesDataValue.map((fileDataValue) =>
                  fileDataValue.file.id === fileData.id
                    ? { ...fileDataValue, preview: preview }
                    : { ...fileDataValue }
                ),
              ])
            })
        } catch (err) {}
      })
      .catch((err: AxiosError) => {
        setError(err.response?.statusText)
        setUploading((num: number) => num - 1)
      })
  }

  const onRemove = (index: number) => {
    axios
      .delete(serverURL + `/api/upload/files/${filesData[index].file?.id}`)
      .then((value) => {
        console.log(value)
      })
      .catch((err: AxiosError) => {
        setError(err.response?.statusText)
        console.log({ ...err })
      })
    setFilesData((filesData) => filesData.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (!filesData || filesData.length === 0) return
    const files = filesData.map((val: FilesDataType) => val.file)
    if (isArrayEqual(files, prev)) return
    onChange && onChange(files)
  }, [filesData])

  useEffect(() => {
    if (value === undefined || value === null) return
    setFilesData(value.map((val) => ({ file: val, preview: null })))
  }, [value])

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
          onReject={(file_error) => setError(file_error[0].errors[0].message)}
          style={{ minWidth: "100%" }}
          multiple={maxFileCount !== 1}
        >
          {(status) => (
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
          )}
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
        {filesData.map((val: FilesDataType, index: number) => (
          <Group key={uuid + "_" + val.file.id + "_" + val.file.name}>
            <div style={{ position: "relative" }}>
              <Image
                src={typeof val.preview === "string" ? val.preview : undefined}
                alt=""
                width={100}
                height={100}
                radius="md"
                fit="cover"
                styles={(theme) => ({
                  image: {
                    visibility:
                      typeof val.preview === "string" ? undefined : "hidden",
                    backgroundColor: "#eee",
                    border:
                      theme.colorScheme === "dark"
                        ? "1px solid #2C2E33"
                        : "1px solid #ced4da",
                  },
                  placeholder: {
                    backgroundColor:
                      theme.colorScheme === "dark" ? "#2C2E33" : "#eee",
                  },
                })}
                withPlaceholder
                placeholder={<FileUnknown size={88} />}
              />
              <Group
                position="center"
                align="center"
                noWrap
                sx={(theme) => ({
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  width: "100%",
                  gap: theme.spacing.xs / 2,
                  transform: "translate(0,-50%)",
                })}
              >
                {typeof val.preview === "string" && (
                  <>
                    <ActionIcon
                      onClick={() => {
                        setPreview(val.preview as string)
                        setPreviewOpened(true)
                      }}
                    >
                      <Eye />
                    </ActionIcon>

                    <div
                      style={{
                        borderLeft: "1px solid rgba(0.3,0.3,0.3,0.5)",
                        height: 20,
                      }}
                    ></div>
                  </>
                )}
                <ActionIcon color="red" onClick={() => onRemove(index)}>
                  <TrashX />
                </ActionIcon>
              </Group>
            </div>
            <Text pr="xl">{val?.file?.name}</Text>
          </Group>
        ))}
        {(filesData.length < maxFileCount || !!uploading) && (
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
            disabled={disabled || !!uploading}
          >
            {uploading ? <LoadingOverlay visible={true} /> : <Plus size={32} />}
          </Button>
        )}
      </Stack>
    </>
  )
}

export default FileList
