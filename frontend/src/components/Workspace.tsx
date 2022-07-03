import { Group } from "@mantine/core"
import { FC, ReactNode } from "react"
import { Outlet } from "react-router-dom"

import ResponsivePaper from "./ResponsivePaper"

interface WorkspaceProps {
  children?: ReactNode
}

const Workspace: FC<WorkspaceProps> = ({ children }) => {
  return (
    <Group
      sx={(theme) => ({
        flexWrap: "nowrap",
        alignItems: "flex-start",
        padding: theme.spacing.md,
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          padding: 0,
        },
      })}
    >
      <ResponsivePaper radius={4}>{children}</ResponsivePaper>
      <ResponsivePaper radius={4} style={{ flexGrow: 1 }}>
        <Outlet />
      </ResponsivePaper>
    </Group>
  )
}

export default Workspace
