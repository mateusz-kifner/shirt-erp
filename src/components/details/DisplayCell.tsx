import React, { ReactNode } from "react"
import { Box, MantineSize, Text } from "@mantine/core"
import { SxBorder, SxRadius } from "../../styles/basic"

// FIXME: make DisplayCell icon respect position
// FIXME: replace it with "mantine" DisplayCell

interface DisplayCellProps {
  icon?: ReactNode
  iconWidth?: number
  size?: MantineSize
  rightSection?: ReactNode
  children: React.ReactNode
  disabled?: boolean
  hovered?: boolean
}

const DisplayCell = (props: DisplayCellProps) => {
  const {
    icon,
    iconWidth,
    size,
    rightSection,
    children,
    disabled = false,
    hovered,
  } = props

  return (
    <Text
      sx={[
        SxRadius,
        (theme) => ({
          position: "relative",
          width: "100%",
          fontSize: theme.fontSizes.sm,
          minHeight: 36,
          wordBreak: "break-word",
          whiteSpace: "pre-line",
          padding: "10px 16px",
          paddingRight: !!rightSection ? 32 : undefined,
          lineHeight: 1.55,
          paddingLeft: !!icon ? 36 : undefined,
          border: hovered
            ? disabled
              ? "1px solid transparent"
              : theme.colorScheme === "dark"
              ? "1px solid #2C2E33"
              : "1px solid #ced4da"
            : "1px solid transparent",
          "&:hover":
            hovered === undefined
              ? {
                  border: disabled
                    ? undefined
                    : theme.colorScheme === "dark"
                    ? "1px solid #2C2E33"
                    : "1px solid #ced4da",
                }
              : {},
        }),
      ]}
    >
      {!!icon && (
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
                : theme.fontSizes[size ?? "md"],
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
