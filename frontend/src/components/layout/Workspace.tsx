import { Group } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useRouter } from "next/router"
import { Children, FC, ReactNode } from "react"
import { getQueryAsArray, setQuery } from "../../utils/nextQueryUtils"

import ResponsivePaper from "../ResponsivePaper"

interface WorkspaceProps {
  childrenWrapperProps?: any[]
  childrenLabels?: string[]
  children?: ReactNode
  defaultViews?: number | number[]
}

const Workspace: FC<WorkspaceProps> = ({
  children,
  childrenLabels,
  childrenWrapperProps = [null],
  defaultViews = 0,
}) => {
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)",
    false
  )

  const router = useRouter()
  if (!router?.query?.show_views) {
    setQuery(router, {
      show_views: Array.isArray(defaultViews)
        ? defaultViews.map((val) => val.toString())
        : defaultViews.toString(),
    })
  }
  const show_views = getQueryAsArray(router, "show_views").map((val) =>
    isNaN(parseInt(val)) ? -1 : parseInt(val)
  )

  const child_array = Children.toArray(children)

  return (
    <Group
      sx={(theme) => ({
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
        show_views.map((childIndex) => (
          <ResponsivePaper
            {...(childrenWrapperProps &&
            childrenWrapperProps[childIndex] !== undefined
              ? childrenWrapperProps[childIndex]
              : { style: { flexGrow: 1 } })}
          >
            {child_array[childIndex]}
          </ResponsivePaper>
        ))}

      {/* {isMobile && (
        <Menu>
          <Menu.Target>
            <ActionIcon
              variant="filled"
              color="orange"
              radius="xl"
              size="xl"
              style={{ position: "fixed", bottom: 2, right: 2, zIndex: 999999 }}
            >
              <Compass size={32} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {children &&
              Children.map(children, (child, index) => (
                <Menu.Item
                  onClick={() => {
                    // setPages([index])
                  }}
                >
                  <Text size="md">
                    {childrenLabels?.[index] ?? "Window " + (index + 1)}
                  </Text>
                </Menu.Item>
              ))}
          </Menu.Dropdown>
        </Menu>
      )} */}
    </Group>
  )
}

export default Workspace
