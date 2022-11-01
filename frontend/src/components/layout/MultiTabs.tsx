import {
  Button,
  ButtonProps,
  Group,
  MantineColor,
  Menu,
  Tooltip,
  Text,
  ActionIcon,
} from "@mantine/core"
import { useMediaQuery, useResizeObserver } from "@mantine/hooks"
import { max, omit } from "lodash"
import React, {
  ComponentPropsWithoutRef,
  ComponentType,
  SyntheticEvent,
  useEffect,
  useId,
  useState,
  MouseEvent,
} from "react"
import { GridDots, Navigation, Pinned, Plus } from "tabler-icons-react"
import { SxBorder } from "../../styles/basic"
import { getRandomColorByString } from "../../utils/getRandomColor"
import { useAuthContext } from "../../context/authContext"
import { useTranslation } from "../../i18n"

export interface TabProps
  extends ButtonProps,
    ComponentPropsWithoutRef<"button"> {
  /** Value that is used to connect Tab with associated panel */
  value: number

  /** Tab label */
  children?: React.ReactNode

  /** Section of content displayed after label */
  rightSection?: React.ReactNode

  /** Section of content displayed before label */
  Icon?: React.ComponentType<any & { size?: number }>

  /** Key of theme.colors */
  color?: MantineColor

  small?: boolean
  setBigSize?: (size: number) => void
  isActive?: boolean
}

export const Tab = (props: TabProps) => {
  const {
    children,
    Icon,
    rightSection,
    small = false,
    setBigSize,
    isActive = false,
    onClick,
    onContextMenu,
  } = props
  const [ref, rect] = useResizeObserver()

  useEffect(() => {
    rect.width !== 0 && !small && setBigSize?.(rect.width + 46)
  }, [rect.width])

  const hasIcon = !!Icon
  const hasRightSection = !!rightSection
  const color = getRandomColorByString((children as string) + "e")
  return (
    <Tooltip label={children} disabled={!small} withinPortal withArrow>
      <Button
        ref={ref}
        variant="outline"
        color="gray"
        size="md"
        style={{ borderEndEndRadius: 0, borderEndStartRadius: 0 }}
        sx={[
          SxBorder,
          () => ({
            color: isActive ? color : undefined,
            borderBottom: isActive ? `2px solid ${color}` : undefined,
            "&:active": {
              transform: "none",
            },
          }),
        ]}
        p={small ? "xs" : undefined}
        {...omit(props, [
          "isActive",
          "setBigSize",
          "small",
          "rightSection",
          "Icon",
          "children",
        ])}
        onClick={onClick}
        onContextMenu={onContextMenu}
      >
        <Group spacing={4} noWrap>
          {hasIcon && <Icon size={16} />}
          {!small && children}
          {hasRightSection && rightSection}
        </Group>
      </Button>
    </Tooltip>
  )
}

interface MultiTabsProps {
  active?: number
  onTabChange: (active?: number) => void

  pinned: number[]
  onPin: (pinned: number) => void

  childrenLabels: string[]
  childrenIcons: ComponentType<any & { size?: number }>[]

  onAddElement?: (e: MouseEvent<any, any>) => void

  availableSpace: number
}

const MultiTabs = (props: MultiTabsProps) => {
  const {
    active,
    onTabChange,
    pinned,
    onPin,
    childrenLabels,
    childrenIcons,
    onAddElement,
    availableSpace,
  } = props
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)"
  )
  const [tabsSizes, setTabsSizes] = useState<number[]>([])
  const { navigationCollapsed } = useAuthContext()
  const uuid = useId()
  const [ref, rect] = useResizeObserver()
  const maxSize = tabsSizes.reduce((prev, next) => prev + next, 0)
  const small = maxSize + 108 > rect.width
  const childrenLabelsKey = childrenLabels.reduce(
    (prev, next) => prev + next,
    ""
  )

  const { t } = useTranslation()
  useEffect(() => {
    setTabsSizes([])
  }, [childrenLabelsKey])

  if (isMobile) {
    return (
      <Menu
        position="bottom"
        closeOnEscape={true}
        closeOnItemClick={true}
        closeOnClickOutside={true}
        withArrow
      >
        <Menu.Target>
          <ActionIcon
            style={{
              position: "fixed",
              zIndex: 102,
              top: 30,
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
            size="xl"
            radius="xl"
          >
            <GridDots size={32} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {childrenLabels.map((label, index) => {
            const Icon =
              childrenIcons?.[index] ??
              childrenIcons?.[childrenIcons.length - 1]
            return (
              <Menu.Item
                px="md"
                icon={<Icon size={32} />}
                onClick={() => onTabChange(index)}
                disabled={index === active}
              >
                <Text size="md">{label}</Text>
              </Menu.Item>
            )
          })}
          {onAddElement && (
            <>
              <Menu.Divider />
              <Menu.Item
                p="md"
                onClick={(event: MouseEvent<any, any>) => onAddElement(event)}
                icon={<Plus />}
              >
                {t("add")}
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
    )
  }

  return (
    <Group
      sx={(theme) => ({
        position: "fixed",
        top: 18,
        zIndex: 102,
        height: 38,
        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
          left: 52,
        },
      })}
      ref={ref}
      style={{ width: availableSpace - 144 }}
    >
      <Button.Group>
        {childrenLabels.map((label, index) => {
          const isPinned = pinned?.includes(index)

          return (
            <Tab
              key={uuid + index + childrenLabelsKey}
              value={index}
              Icon={
                childrenIcons?.[index] ??
                childrenIcons?.[childrenIcons.length - 1]
              }
              small={small}
              setBigSize={(size) =>
                setTabsSizes((val) => {
                  let new_arr = [...val]
                  new_arr[index] = size
                  return new_arr
                })
              }
              rightSection={isPinned ? <Pinned size={16} /> : undefined}
              isActive={active === index || isPinned}
              onClick={() => !isPinned && onTabChange(index)}
              onContextMenu={(e: SyntheticEvent) => {
                e.preventDefault()
                onPin(index)
              }}
            >
              {label}
            </Tab>
          )
        })}
        {onAddElement && (
          <Tab
            value={childrenLabels.length}
            p="xs"
            variant="outline"
            onClick={(event: MouseEvent<any, any>) => onAddElement(event)}
            onContextMenu={(event: MouseEvent<any, any>) => {
              event.preventDefault()
              onAddElement(event)
            }}
            Icon={Plus}
          ></Tab>
        )}
      </Button.Group>
    </Group>
  )
}

export default MultiTabs
