import { Loader, MantineSize, ThemeIcon, useMantineTheme } from "@mantine/core"
import React, { CSSProperties } from "react"
import { IconCheck, IconX } from "@tabler/icons-react"

interface ApiStatusIndicatorProps {
  status: "loading" | "idle" | "error" | "success"
  style: CSSProperties
  size?: MantineSize
}

const ApiStatusIndicator = ({
  status,
  style,
  size = "xs",
}: ApiStatusIndicatorProps) => {
  const theme = useMantineTheme()
  return (
    <ThemeIcon
      radius="xl"
      size={size}
      style={style}
      color={
        status === "success"
          ? "green"
          : status === "error"
          ? "red"
          : "#00000000"
      }
    >
      {status === "success" && (
        <IconCheck size={theme.fontSizes[size ?? "md"]} />
      )}
      {status === "error" && <IconX size={theme.fontSizes[size ?? "md"]} />}
      {status === "loading" && <Loader />}
    </ThemeIcon>
  )
}

export default ApiStatusIndicator
