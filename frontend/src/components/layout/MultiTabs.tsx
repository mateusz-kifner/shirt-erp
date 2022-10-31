import {
  Button,
  ButtonProps,
  Group,
  MantineColor,
  Sx,
  Tooltip,
} from "@mantine/core"
import { useElementSize } from "@mantine/hooks"
import { omit } from "lodash"
import React, {
  Children,
  cloneElement,
  ComponentPropsWithoutRef,
  CSSProperties,
  Dispatch,
  ReactElement,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react"
import { Pinned, Plus } from "tabler-icons-react"
import { SxBorder } from "../../styles/basic"
import { getRandomColorByString } from "../../utils/getRandomColor"

export interface TabProps
  extends ButtonProps,
    ComponentPropsWithoutRef<"button"> {
  /** Value that is used to connect Tab with associated panel */
  value: string

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
  } = props
  const { width, ref } = useElementSize()

  useEffect(() => {
    width !== 0 && !small && setBigSize?.(width)
  }, [width])

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
  children: ReactElement[] | ReactElement | null
  style?: CSSProperties
  sx?: Sx
  onAddElement?: () => void
  value: string | null
  pinned?: string[]
  onPin: (value: string) => void
  onTabChange: Dispatch<SetStateAction<string | null>>
  availableSpace: number
}

const MultiTabs = (props: MultiTabsProps) => {
  const [tabsSizes, setTabsSizes] = useState<number[]>([])
  const {
    children,
    onAddElement,
    availableSpace,
    pinned,
    value,
    onTabChange,
    onPin,
    sx,
  } = props
  const { width, ref } = useElementSize()

  return (
    <Group sx={sx} ref={ref} style={{ width: availableSpace - 194 }}>
      <Button.Group>
        {Children.map(children, (child, index) => {
          const isPinned = pinned?.includes(child?.props.value)
          return (
            child &&
            cloneElement(child, {
              small:
                tabsSizes.reduce((prev, next) => prev + next, 0) > width - 194,
              setBigSize: (size: number) =>
                setTabsSizes((val) => {
                  let new_arr = [...val]
                  new_arr[index] = size
                  return new_arr
                }),
              rightSection: isPinned ? <Pinned size={16} /> : undefined,
              isActive: child.props.value === value || isPinned,
              onClick: () => !isPinned && onTabChange(child.props.value),
              onContextMenu: (e: SyntheticEvent) => {
                e.preventDefault()
                onPin(child.props.value)
              },
            })
          )
        })}
        <Tab
          value="plus"
          p="xs"
          variant="outline"
          onClick={onAddElement}
          Icon={Plus}
          small={false}
          setBigSize={(size: number) =>
            setTabsSizes((val) => {
              let new_arr = [...val]
              new_arr[Children.count(children)] = size
              return new_arr
            })
          }
        ></Tab>
      </Button.Group>
    </Group>
  )
}

export default MultiTabs
