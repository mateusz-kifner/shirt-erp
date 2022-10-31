import { Group, Tabs } from "@mantine/core"
import { useElementSize } from "@mantine/hooks"
import { useRouter } from "next/router"
import {
  Children,
  ComponentType,
  ReactNode,
  useEffect,
  useId,
  useState,
} from "react"
import { useAuthContext } from "../../context/authContext"
import { getQueryAsArray, setQuery } from "../../utils/nextQueryUtils"

import ResponsivePaper from "../ResponsivePaper"
import MultiTabs, { Tab } from "./MultiTabs"

interface WorkspaceProps {
  childrenWrapperProps?: any[]
  childrenLabels?: string[]
  childrenIcons?: ComponentType<any & { size?: number }>[]
  children?: ReactNode
  defaultViews?: number | number[]
}

const Workspace = ({
  children,
  childrenLabels,
  childrenIcons,
  childrenWrapperProps = [null],
  defaultViews = 0,
}: WorkspaceProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(
    childrenLabels?.[0] ?? null
  )
  const [pinned, setPinned] = useState<string[]>([])
  const uuid = useId()
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

  const { navigationCollapsed, toggleNavigationCollapsed, debug } =
    useAuthContext()
  const { ref, width } = useElementSize()

  useEffect(() => {
    if (!childrenLabels) return
    let new_arr = [...pinned]
    if (activeTab && !pinned.includes(activeTab)) new_arr.push(activeTab)
    let index_arr = new_arr.map((val) => childrenLabels?.indexOf(val))
    setQuery(router, {
      show_views: index_arr.map((val) => val.toString()),
    })
  }, [pinned, activeTab])

  return (
    <Group
      ref={ref}
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
      <MultiTabs
        value={activeTab}
        onTabChange={setActiveTab}
        pinned={pinned}
        onPin={(value) =>
          setPinned((val) =>
            val.includes(value)
              ? val.filter((val2) => val2 !== value)
              : [...val, value]
          )
        }
        sx={(theme) => ({
          position: "fixed",
          top: 18,
          zIndex: 102,
          height: 38,
          [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            left: 52,
          },
        })}
        availableSpace={width}
      >
        {childrenLabels
          ? childrenLabels?.map((label, index) => (
              <Tab
                value={label}
                Icon={
                  childrenIcons?.[index]
                    ? childrenIcons?.[index]
                    : childrenIcons?.[childrenIcons.length - 1]
                }
                key={uuid + "_tab_" + index}
              >
                {label}
              </Tab>
            ))
          : null}
      </MultiTabs>

      {children &&
        show_views.map((childIndex, index) => (
          <ResponsivePaper
            {...(childrenWrapperProps &&
            childrenWrapperProps[childIndex] !== undefined
              ? childrenWrapperProps[childIndex]
              : { style: { flexGrow: 1 } })}
            key={uuid + index}
          >
            {child_array[childIndex]}
          </ResponsivePaper>
        ))}
    </Group>
  )
}

export default Workspace
