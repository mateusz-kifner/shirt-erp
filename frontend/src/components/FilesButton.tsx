import { Dropzone, DropzoneStatus } from "@mantine/dropzone"
import React, { FC, useEffect, useState } from "react"
import { FileType } from "../types/FileType"
import { Group, MantineTheme, Text, useMantineTheme } from "@mantine/core"
import { Photo, Upload, X, Icon as TablerIcon } from "tabler-icons-react"

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
}

const FilesButton: FC<FilesButtonProps> = ({}) => {
  const [files, setFiles] = useState<File[]>([])
  const [preview, setPreview] = useState<string>("")
  const theme = useMantineTheme()

  useEffect(() => {
    files.length > 0 && getBase64(files[0]).then((val: any) => setPreview(val))
  }, [files])
  return (
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
          {preview.length > 0 && (
            <div>
              <img
                src={preview}
                alt=""
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
          )}
        </Group>
      )}
    </Dropzone>
  )
}

export default FilesButton
