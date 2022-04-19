import { Dropzone, DropzoneStatus } from "@mantine/dropzone"
import React, { FC, useEffect, useState } from "react"
import { FileType } from "../types/FileType"
import {
  Group,
  Image,
  MantineTheme,
  Text,
  useMantineTheme,
} from "@mantine/core"
import { Photo, Upload, X, Icon as TablerIcon } from "tabler-icons-react"
import axios, { AxiosError } from "axios"
import { serverURL } from "../env"

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.colors.gray[7]
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

interface FilesButtonProps {
  onChange?: (files: FileType[]) => void
  value?: FileType[]
}

const FilesButton: FC<FilesButtonProps> = ({ onChange, value }) => {
  const [files, setFiles] = useState<File[]>([])
  const [preview, setPreview] = useState<string>("")
  const [error, setError] = useState<string | undefined>()
  const [uploading, setUploading] = useState<boolean>(false)
  const theme = useMantineTheme()

  useEffect(() => {
    if (files.length <= 0) return

    const formData = new FormData()
    for (let file of files) {
      console.log(file)
      formData.append("files", file)
    }
    console.log(formData.getAll("files"))
    getBase64(files[0]).then((val: any) => setPreview(val))
    axios
      .post(serverURL + "/api/upload", formData)
      .then((val) => {
        setUploading(false)
        if (value) onChange && onChange([...value, ...val.data])
        else onChange && onChange([...val.data])

        console.log(val)
      })
      .catch((err: AxiosError) => {
        setError(err.response?.statusText)
        setUploading(false)
        console.log({ ...err })
      })
  }, [files])

  return preview.length > 0 ? (
    <div>
      <Image
        src={preview}
        alt=""
        width={100}
        height={100}
        radius="md"
        fit="cover"
      />
    </div>
  ) : (
    <Dropzone
      onDrop={setFiles}
      onReject={(files) => console.log("rejected files", files)}
      style={{ minWidth: "100%" }}
      multiple={false}
    >
      {(status) => (
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: 160, pointerEvents: "none" }}
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
      )}
    </Dropzone>
  )
}

export default FilesButton
