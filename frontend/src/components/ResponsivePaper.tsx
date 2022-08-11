import { Paper, PaperProps } from "@mantine/core"
import { unset } from "lodash"
import { FC } from "react"

const ResponsivePaper: FC<PaperProps> = (props) => {
  return (
    <Paper
      shadow="xs"
      withBorder
      p="xl"
      sx={(theme) => ({
        borderRadius:
          props?.radius && typeof props.radius === "number"
            ? props.radius
            : theme.spacing[
                props?.radius && typeof props.radius === "string"
                  ? props.radius
                  : "xl"
              ],
        minWidth: 420,
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          borderRadius: 4,
          minWidth: "100%",
        },
      })}
      {...props}
    >
      {props.children}
    </Paper>
  )
}

export default ResponsivePaper
