import { ActionIcon, Group, Menu, Text } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useGesture } from "@use-gesture/react"
import { Children, FC, ReactNode, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { Compass } from "tabler-icons-react"

import ResponsivePaper from "../ResponsivePaper"

interface WorkspaceProps {
  childrenWrapperProps?: any[]
  childrenLabels?: string[]
  children?: ReactNode
  currentPage?: number
}

const Workspace: FC<WorkspaceProps> = ({
  children,
  childrenLabels,
  childrenWrapperProps,
  currentPage,
}) => {
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)"
  )
  const [page, setPage] = useState(0)

  useEffect(() => {
    currentPage && setPage(currentPage)
  }, [currentPage])

  return (
    <Group
      sx={(theme) => ({
        // position: "relative",
        flexWrap: "nowrap",
        alignItems: "flex-start",
        padding: theme.spacing.md,
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          padding: 4,
        },
        overflow: "hidden",
      })}
    >
      {children &&
        Children.map(
          children,
          (child, index) =>
            (!isMobile || (isMobile && page === index)) && (
              <ResponsivePaper
                radius={4}
                {...(childrenWrapperProps &&
                  childrenWrapperProps[index] &&
                  childrenWrapperProps[index])}
              >
                {child}
              </ResponsivePaper>
            )
        )}

      {isMobile && (
        <Menu
          style={{ position: "fixed", bottom: 2, right: 2 }}
          control={
            <ActionIcon variant="filled" color="orange" radius="xl" size="xl">
              <Compass size={32} />
            </ActionIcon>
          }
          transition="slide-right"
          transitionDuration={100}
          transitionTimingFunction="ease"
          size="xl"
        >
          {children &&
            Children.map(children, (child, index) => (
              <Menu.Item
                onClick={() => {
                  setPage(index)
                }}
              >
                <Text size="md">
                  {(childrenLabels && childrenLabels[index]) ??
                    "Window " + (index + 1)}
                </Text>
              </Menu.Item>
            ))}
        </Menu>
      )}
    </Group>
  )
}

export default Workspace
