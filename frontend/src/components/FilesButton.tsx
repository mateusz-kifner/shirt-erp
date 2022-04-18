import { Dropzone, DropzoneStatus } from "@mantine/dropzone"
import React, { FC } from "react"
import { FileType } from "../types/FileType"
import { Group, MantineTheme, Text, useMantineTheme } from "@mantine/core"
import { Photo, Upload, X, Icon as TablerIcon } from "tabler-icons-react"

interface FilesButtonProps {
  onChange?: (files: FileType[]) => void
}

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

export const dropzoneChildren = (
  status: DropzoneStatus,
  theme: MantineTheme
) => (
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
)

const FilesButton: FC<FilesButtonProps> = ({}) => {
  const theme = useMantineTheme()

  return (
    <Dropzone
      onDrop={(files) => console.log("accepted files", files)}
      onReject={(files) => console.log("rejected files", files)}
      style={{ minWidth: "100%" }}
      multiple={false}
    >
      {(status) => dropzoneChildren(status, theme)}
    </Dropzone>
  )
}

export default FilesButton
