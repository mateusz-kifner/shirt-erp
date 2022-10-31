import { Group, Menu, Text } from "@mantine/core"
import { useElementSize, useMediaQuery } from "@mantine/hooks"
import { useRouter } from "next/router"
import {
  Children,
  ComponentType,
  ReactNode,
  useId,
  useState,
  MouseEvent,
} from "react"
import { useTranslation } from "react-i18next"
import { Plus } from "tabler-icons-react"
import { useAuthContext } from "../../context/authContext"
import {
  getQueryAsArray,
  getQueryAsIntOrNull,
  setQuery,
} from "../../utils/nextQueryUtils"

import ResponsivePaper from "../ResponsivePaper"
import MultiTabs from "./MultiTabs"

interface WorkspaceProps {
  childrenWrapperProps?: any[]
  childrenLabels?: string[]
  childrenIcons?: ComponentType<any & { size?: number }>[]
  children?: ReactNode
  defaultActive?: number
  defaultPinned?: number[]
  addElementLabels?: string[]
  addElementIcons?: ComponentType<any & { size?: number }>[]
  onAddElement: (element: number) => void
}

const Workspace = ({
  children,
  childrenLabels = [],
  childrenIcons = [],
  childrenWrapperProps = [null],
  defaultActive = 1,
  defaultPinned = [0],
  onAddElement,
  addElementLabels = [],
  addElementIcons = [],
}: WorkspaceProps) => {
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)"
  )
  const [menuPosition, setMenuPosition] = useState<[number, number]>([0, 0])
  const [menuOpened, setMenuOpen] = useState<boolean>(false)
  const uuid = useId()
  const router = useRouter()
  if (
    typeof router?.query?.pinned !== "string" ||
    typeof router?.query?.active !== "string"
  ) {
    setQuery(router, {
      pinned: defaultPinned,
      active: defaultActive,
    })
  }
  const { t } = useTranslation()
  const pinned = getQueryAsArray(router, "pinned")
    .map((val) => (isNaN(parseInt(val)) ? null : parseInt(val)))
    .filter((value) => value !== null) as number[]

  const active = getQueryAsIntOrNull(router, "active") ?? undefined

  const child_array = Children.toArray(children)

  const { navigationCollapsed, toggleNavigationCollapsed, debug } =
    useAuthContext()
  const { ref, width } = useElementSize()

  const activeTabs = isMobile ? [] : [...pinned]
  if (active !== undefined) activeTabs.push(active)

  // useEffect(() => {
  //   if (!childrenLabels) return
  //   let new_arr = [...pinned]
  //   if (active && !pinned.includes(active)) new_arr.push(active)
  //   let index_arr = new_arr.map((val) => childrenLabels?.indexOf(val))
  //   setQuery(router, {
  //     show_views: index_arr.map((val) => val.toString()),
  //   })
  // }, [pinned, active])

  const openMenu = (e: MouseEvent<any, any>) => {
    setMenuPosition(isMobile ? [width / 2, 60] : [e.pageX, e.pageY])
    setMenuOpen(true)
  }

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
      <Menu
        opened={menuOpened}
        position="bottom-end"
        onChange={setMenuOpen}
        closeOnEscape={true}
        closeOnItemClick={true}
        closeOnClickOutside={true}
        styles={{
          dropdown: {
            position: "absolute",
            top: menuPosition[1],
            left: menuPosition[0],
          },
        }}
      >
        <Menu.Dropdown onBlur={() => setMenuOpen(false)}>
          <Menu.Item py={4}>
            <Text color="grey" size="xs">
              {t("close")}
            </Text>
          </Menu.Item>
          {addElementLabels.map((label, index) => {
            const Icon = addElementIcons?.[index]
              ? addElementIcons[index]
              : Plus
            return (
              <Menu.Item
                icon={<Icon size={18} />}
                onClick={() => onAddElement(index)}
              >
                {t(label as any)}
              </Menu.Item>
            )
          })}
        </Menu.Dropdown>
      </Menu>
      <MultiTabs
        active={active}
        onTabChange={(value) =>
          setQuery(router, {
            pinned,
            active: value,
          })
        }
        pinned={pinned}
        onPin={(value) =>
          setQuery(router, {
            pinned: pinned.includes(value)
              ? pinned.filter((val2) => val2 !== value)
              : [...pinned, value],
            active,
          })
        }
        childrenLabels={childrenLabels}
        childrenIcons={childrenIcons}
        availableSpace={width}
        onAddElement={(e) => openMenu(e)}
      />
      {children &&
        activeTabs.map((childIndex, index) => (
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
