import { ActionIcon, Group, Image, Text } from "@mantine/core"
import { FC } from "react"
import { Eye, FileUnknown, TrashX } from "tabler-icons-react"
import { env } from "../../../env/client.mjs"
import { FileType } from "../../../types/FileType"

interface FileDisplayProps {
  fileData: FileType
  disabled?: boolean
  onPreview?: (url: string) => void
}

const FileDisplay: FC<FileDisplayProps> = (props) => {
  const { fileData, disabled, onPreview } = props
  console.log(fileData.id, fileData.token)
  return (
    <Group>
      <div style={{ position: "relative" }}>
        <Image
          src={
            typeof fileData?.formats?.thumbnail?.url === "string"
              ? env.NEXT_PUBLIC_SERVER_API_URL +
                fileData.formats.thumbnail?.url +
                "?token=" +
                fileData.token
              : typeof fileData?.url === "string"
              ? env.NEXT_PUBLIC_SERVER_API_URL +
                fileData.url +
                "?token=" +
                fileData.token
              : undefined
          }
          alt=""
          width={100}
          height={100}
          radius="md"
          fit="cover"
          styles={(theme) => ({
            image: {
              // visibility:
              //   typeof fileData.formats?.thumbnail?.url === "string"
              //     ? undefined
              //     : "hidden",
              backgroundColor:
                theme.colorScheme === "dark" ? "#2C2E33" : "#eee",

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
          {typeof fileData.formats?.thumbnail?.url === "string" && (
            <>
              <ActionIcon
                onClick={() => {
                  fileData?.url && onPreview && onPreview(fileData.url)
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
          {!disabled && (
            <ActionIcon
              color="red"
              onClick={
                () => {}
                // onRemove(index)
              }
            >
              <TrashX />
            </ActionIcon>
          )}
        </Group>
      </div>
      <Text pr="xl">{fileData.name}</Text>
    </Group>
  )
}

export default FileDisplay
