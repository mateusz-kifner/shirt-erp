import {
  Group,
  MantineTheme,
  Modal,
  useMantineTheme,
  Text,
} from "@mantine/core"
import { Dropzone, DropzoneStatus } from "@mantine/dropzone"
import { FC, useState } from "react"
import { Photo, Upload, X, Icon as TablerIcon } from "tabler-icons-react"
import { FileType } from "../types/FileType"
import { StrapiEntryType } from "../types/StrapiEntryType"

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

interface FileListProps {
  onChange?: (files: StrapiEntryType<FileType>[] | null) => void
  value?: StrapiEntryType<FileType>[] | null
  disabled?: boolean
}

const FileList: FC<FileListProps> = ({ onChange, value, disabled }) => {
  const theme = useMantineTheme()
  const [fileData, setFileData] = useState<StrapiEntryType<FileType> | null>(
    null
  )

  const [preview, setPreview] = useState<string>("")
  const [error, setError] = useState<string | undefined>()
  const [uploading, setUploading] = useState<boolean>(false)

  const [opened, setOpened] = useState<boolean>(false)
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        <Dropzone
          onDrop={(val) => {
            // onUpload(val[0])
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
    </>
  )
}

export default FileList
