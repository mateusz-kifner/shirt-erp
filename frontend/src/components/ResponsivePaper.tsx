import { Paper, PaperProps } from "@mantine/core"
import { FC } from "react"

const ResponsivePaper: FC<PaperProps<any>> = (props) => {
  return (
    <Paper
      shadow="xs"
      withBorder
      p="xl"
      sx={(theme) => ({
        borderRadius: theme.spacing.xl,
        minWidth: 420,
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          borderRadius: 0,
        },
      })}
      {...props}
    >
      {props.children}
    </Paper>
  )
}

export default ResponsivePaper
