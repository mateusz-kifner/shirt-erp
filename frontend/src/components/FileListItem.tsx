import {
  ActionIcon,
  Box,
  Group,
  Image,
  Text,
  useMantineTheme,
  Tooltip,
  CSSObject,
  Portal,
} from "@mantine/core"
import { useClickOutside } from "@mantine/hooks"
import React, { CSSProperties, ReactNode, useState } from "react"
import { IconDownload, IconEye, IconFileUnknown } from "@tabler/icons-react"
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
  menuNode: ReactNode
}

const FileListItem = ({
  value,
  onChange,
  active,
  disabled,
  onPreview,
  style,
  menuNode,
}: FileListItemProps) => {
  const { t } = useTranslation()
  const theme = useMantineTheme()
  const [menuData, setMenuData] = useState<{
    opened: boolean
    x: number
    y: number
  }>({ opened: false, x: 0, y: 0 })
  const clickOutsideRef = useClickOutside(() => {
    setMenuData({ opened: false, x: 0, y: 0 })
  })

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

  const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    setMenuData({ opened: true, x: e.pageX, y: e.pageY })
  }
  return (
    <Group
      sx={[SxBorder, SxRadius, { overflow: "hidden", position: "relative" }]}
      align="center"
      style={style}
      onContextMenu={onContextMenu}
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
            <IconFileUnknown
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
            <IconEye
              color={
                theme.colorScheme === "dark"
                  ? theme.colors.gray[4]
                  : theme.colors.gray[8]
              }
              size={26}
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
        size={120}
        component="a"
        href={
          env.NEXT_PUBLIC_SERVER_API_URL +
          "/api/upload/download/" +
          value?.id +
          (value?.token && !value.public ? "?token=" + value?.token : "")
        }
        download
        tabIndex={-1}
        radius={99999}
        sx={(theme) => ({
          background:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          position: "absolute",
          top: "50%",
          right: "-3rem",
          transform: "translate(0,-50%)",
        })}
      >
        <IconDownload size={26} />
        <div style={{ width: "2.4rem" }}></div>
      </ActionIcon>

      <Portal>
        <div
          style={{
            display: menuData.opened ? "block" : "none",
            position: "absolute",
            top: menuData.y,
            left: menuData.x,
          }}
          ref={clickOutsideRef}
        >
          {menuNode}
        </div>
      </Portal>
    </Group>
  )
}

export default FileListItem
