import React, { FC } from "react"
import { Text } from "@mantine/core"
import { SxBorder, SxRadius } from "../../styles/basic"
import TablerIconType from "../../types/TablerIconType"

interface DisplayCellProps {
  Icon?: TablerIconType
  children: React.ReactNode
}

const DisplayCell: FC<DisplayCellProps> = (props) => {
  const { Icon, children } = props
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
    </Text>
  )
}

export default DisplayCell
