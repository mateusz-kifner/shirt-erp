import React, { FC, ReactNode } from "react"
import { Box, MantineSize, Text } from "@mantine/core"
import { SxBorder, SxRadius } from "../../styles/basic"

// FIXME: make DisplayCell icon respect position
// FIXME: replace it with "mantine" DisplayCell

const sizes = {
  xs: 30,
  sm: 36,
  md: 42,
  lg: 50,
  xl: 60,
}
interface DisplayCellProps {
  icon?: ReactNode
  iconWidth?: number
  size?: MantineSize
  rightSection?: ReactNode
  children: React.ReactNode
}

const DisplayCell = (props: DisplayCellProps) => {
  const { icon, iconWidth, size, rightSection, children } = props
  return (
    <Text
      sx={[
        (theme) => ({
          position: "relative",
          width: "100%",
          fontSize: theme.fontSizes.sm,
          minHeight: 36,
          wordBreak: "break-word",
          whiteSpace: "pre-line",
          padding: "10px 16px",
          paddingRight: 32,
          lineHeight: 1.55,
          paddingLeft: 36,
        }),
        SxBorder,
        SxRadius,
      ]}
    >
      {icon && (
        <Box
          sx={(theme) => ({
            pointerEvents: "none",
            position: "absolute",
            zIndex: 1,
            left: 0,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width:
              typeof iconWidth === "number"
                ? iconWidth
                : theme.fn.size({ size: size ?? 42, sizes }),
            color:
              theme.colorScheme === "dark"
                ? theme.colors.dark[2]
                : theme.colors.gray[5],
          })}
        >
          {icon}
        </Box>
      )}
      {children}
      <Box
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: -40,
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          width: 200,
        }}
      >
        {rightSection}
      </Box>
    </Text>
  )
}

export default DisplayCell
