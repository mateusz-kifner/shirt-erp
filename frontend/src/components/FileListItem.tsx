import {
  ActionIcon,
  Box,
  Group,
  Image,
  Text,
  useMantineTheme,
  Tooltip,
  CSSObject,
} from "@mantine/core"
import React, { CSSProperties } from "react"
import { Download, Eye, FileUnknown, TrashX } from "tabler-icons-react"
import { env } from "../env/client.mjs"
import { useTranslation } from "../i18n"
import { SxBorder, SxRadius } from "../styles/basic"
import { FileType } from "../types/FileType"

interface FileListItemProps {
  onChange?: (file: Partial<FileType>) => void
  value: Partial<FileType>
  active?: boolean
  disabled?: boolean
  onPreview?: (
    url: string,
    width?: number | null,
    height?: number | null
  ) => void
  style?: CSSProperties
}

const FileListItem = ({
  value,
  onChange,
  active,
  disabled,
  onPreview,
  style,
}: FileListItemProps) => {
  const { t } = useTranslation()
  const theme = useMantineTheme()

  const preview =
    value.mime?.startsWith("image") &&
    env.NEXT_PUBLIC_SERVER_API_URL !== undefined
      ? env.NEXT_PUBLIC_SERVER_API_URL +
        (value?.formats?.thumbnail?.url
          ? value?.formats?.thumbnail.url +
            (value?.token && !value.public ? "?token=" + value?.token : "")
          : value.url +
            (value?.token && !value.public ? "?token=" + value?.token : ""))
      : undefined
  return (
    <div
      className="flex flex-row gap-3 overflow-hidden items-center radius border-2 border-solid  border-gray-300 dark:border-dark-400"
      style={style}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          "&:hover > *": { visibility: "visible" },
        }}
      >
        <Image
          src={preview}
          alt=""
          width={100}
          height={100}
          fit="cover"
          styles={(theme) => ({
            image: {
              visibility: undefined,
              borderRadius: typeof preview === "string" ? undefined : "100%",
              overflow: "hidden",
              padding: 0,
              margin: 0,
              backgroundColor:
                theme.colorScheme === "dark" ? "#2C2E33" : "#eee",
            },
            placeholder: {
              backgroundColor:
                theme.colorScheme === "dark" ? "#2C2E33" : "#eee",
              padding: 0,
              margin: 0,
            },
          })}
          withPlaceholder
          placeholder={
            <FileUnknown
              size={88}
              color={
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.colors.gray[4]
              }
            />
          }
        />

        {preview && onPreview && (
          <ActionIcon
            sx={(theme) => ({
              visibility: "hidden",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 102,
              height: 100,
              width: 100,

              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark" ? "#00000088" : "#ffffff88",
              },
            })}
            onClick={() => {
              value?.url &&
                onPreview(
                  env.NEXT_PUBLIC_SERVER_API_URL +
                    value.url +
                    (value?.token && !value.public
                      ? "?token=" + value?.token
                      : ""),
                  value.width,
                  value.height
                )
            }}
          >
            <Eye
              color={
                theme.colorScheme === "dark"
                  ? theme.colors.gray[4]
                  : theme.colors.gray[8]
              }
            />
          </ActionIcon>
        )}
      </Box>
      <Tooltip
        label={value?.name}
        multiline
        width={400}
        style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
        withArrow
        openDelay={500}
        disabled={!!(value?.name && value?.name?.length < 40)}
      >
        <Text
          pr="xl"
          style={{
            flexGrow: 1,
            overflowWrap: "break-word",
            maxWidth: "calc(100% - 180px)",
            maxHeight: 90,
          }}
          lineClamp={100}
        >
          {value?.name}
        </Text>
      </Tooltip>
      <ActionIcon
        component="a"
        href={
          env.NEXT_PUBLIC_SERVER_API_URL +
          "/api/upload/download/" +
          value?.id +
          (value?.token && !value.public ? "?token=" + value?.token : "")
        }
        download
        mr="sm"
      >
        <Download />
      </ActionIcon>
    </div>
  )
}

export default FileListItem
