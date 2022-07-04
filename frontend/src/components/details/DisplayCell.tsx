import React, { FC, ReactNode } from "react"
import { Box, Text } from "@mantine/core"
import { SxBorder, SxRadius } from "../../styles/basic"
import TablerIconType from "../../types/TablerIconType"

// FIXME: make DisplayCell compatible with mantine
// FIXME: make DisplayCell accept icon as ReactNode
// FIXME: make DisplayCell accept rightSection as ReactNode

interface DisplayCellProps {
  Icon?: TablerIconType
  rightSection?: ReactNode
  children: React.ReactNode
}

const DisplayCell: FC<DisplayCellProps> = (props) => {
  const { Icon, rightSection, children } = props
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
      {Icon && (
        <Icon
          color="#adb5bd"
          size={18}
          style={{
            top: 12,
            left: 8,
            position: "absolute",
          }}
        />
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
