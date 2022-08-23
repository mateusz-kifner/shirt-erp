import { Loader, MantineSize, ThemeIcon, useMantineTheme } from "@mantine/core"
import React, { CSSProperties } from "react"
import { Check, X } from "tabler-icons-react"
const sizes = {
  xs: 30,
  sm: 36,
  md: 42,
  lg: 50,
  xl: 60,
}
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
      {status === "success" && <Check size={theme.fn.size({ size, sizes })} />}
      {status === "error" && <X size={theme.fn.size({ size, sizes })} />}
      {status === "loading" && <Loader />}
    </ThemeIcon>
  )
}

export default ApiStatusIndicator
