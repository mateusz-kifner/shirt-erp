import { Dropzone, DropzoneStatus } from "@mantine/dropzone"
import React, { FC, useState } from "react"
import { FileType } from "../types/FileType"
import {
  Button,
  Group,
  Image,
  LoadingOverlay,
  MantineTheme,
  Modal,
  Text,
  useMantineTheme,
} from "@mantine/core"
import {
  Photo,
  Upload,
  X,
  Icon as TablerIcon,
  Plus,
  TrashX,
} from "tabler-icons-react"
import axios, { AxiosError } from "axios"
import { serverURL } from "../env"
import _ from "lodash"

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
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />
  }

  if (status.rejected) {
    return <X {...props} />
  }

  return <Photo {...props} />
}

function getBase64(file: File | undefined) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file as Blob)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

interface FileButtonProps {
  onChange?: (files: FileType | null) => void
  value?: FileType | null
  disabled?: boolean
}

const FileButton: FC<FileButtonProps> = ({ onChange, value, disabled }) => {
  const [fileData, setFileData] = useState<FileType | null>(
    value ? value : null
  )

  const [preview, setPreview] = useState<string>("")
  const [error, setError] = useState<string | undefined>()
  const [uploading, setUploading] = useState<boolean>(false)

  const theme = useMantineTheme()
  const [opened, setOpened] = useState<boolean>(false)

  const onUpload = (file: File) => {
    if (!file) return
    setUploading(true)

    const formData = new FormData()
    formData.append("files", file)
    console.log(formData.getAll("files"))

    axios
      .post(serverURL + "/api/upload", formData)
      .then((val: any) => {
        setUploading(false)
        setFileData({ ...val.data[0] })
        onChange && onChange({ ...val.data[0] })

        if (isFileImage(file))
          getBase64(file).then((val: any) => setPreview(val))
        else
          setPreview(
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-file-unknown' width='48' height='48' viewBox='0 0 24 24' stroke-linecap='round' stroke-linejoin='round'%3E%3Cstyle%3Epath {stroke: %23333;stroke-width:2;fill:none;}%3C/style%3E%3Cpath d='M14 3v4a1 1 0 0 0 1 1h4'%3E%3C/path%3E%3Cpath d='M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z'%3E%3C/path%3E%3Cpath d='M12 17v.01'%3E%3C/path%3E%3Cpath d='M12 14a1.5 1.5 0 1 0 -1.14 -2.474'%3E%3C/path%3E%3C/svg%3E"
          )

        console.log(val)
      })
      .catch((err: AxiosError) => {
        setError(err.response?.statusText)
        setUploading(false)
      })
  }
  const onRemove = () => {
    axios
      .delete(serverURL + `/api/upload/files/${fileData?.id}`)
      .then((value) => {
        console.log(value)
      })
      .catch((err: AxiosError) => {
        setError(err.response?.statusText)
        console.log({ ...err })
      })
    onChange && onChange(null)
  }

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Dropzone
          onDrop={(val) => {
            onUpload(val[0])
            setOpened(false)
          }}
          onReject={(file_error) => setError(file_error[0].errors[0].message)}
          style={{ minWidth: "100%" }}
          multiple={false}
          loading={uploading}
        >
          {(status) => (
            <Group
              position="center"
              spacing="xl"
              style={{ minHeight: 260, pointerEvents: "none" }}
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
      {preview.length > 0 && setFileData ? (
        <div style={{ position: "relative" }}>
          <Group>
            <Image
              src={preview}
              alt=""
              width={100}
              height={100}
              radius="md"
              fit="cover"
              styles={(theme) => ({
                image: { backgroundColor: "#eee" },
              })}
            />
            <Text pr="xl">{fileData?.name}</Text>
          </Group>
          <Button
            onClick={() => {
              setPreview("")
              onRemove()
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            sx={(theme) => ({
              backgroundColor: "transparent",
              color: "transparent",
              "&:hover": {
                backgroundColor: "rgba(0.1,0.1,0.1,0.5)",
                color: theme.colors.red[8],
              },
              "&:disabled": {
                backgroundColor: "rgba(0.1,0.1,0.1,0.5) !important",
                color: "transparent !important",
              },
            })}
            radius="md"
            disabled={disabled}
          >
            <TrashX size={32} />
          </Button>
        </div>
      ) : (
        <Button
          variant="default"
          styles={{
            root: {
              height: 100,
              width: 100,
            },
          }}
          onClick={() => !uploading && setOpened(true)}
          radius="md"
          disabled={disabled}
        >
          {uploading ? (
            <LoadingOverlay visible={uploading} />
          ) : (
            <Plus size={32} />
          )}
        </Button>
      )}
    </>
  )
}

export default FileButton
