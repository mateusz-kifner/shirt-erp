import { cloneElement, FC, ReactNode, Ref, SyntheticEvent } from "react"

import {
  DefaultMantineColor,
  Group,
  ThemeIcon,
  UnstyledButton,
  Text,
  MantineGradient,
  Avatar,
  MantineNumberSize,
} from "@mantine/core"
import { ChevronRight } from "tabler-icons-react"
import { Link } from "react-router-dom"

interface NavButtonProps {
  label: string
  Icon?: ReactNode
  to: any
  color?: DefaultMantineColor
  gradient?: MantineGradient
  onClick?: (e: SyntheticEvent) => void
  size?: MantineNumberSize
  small?: boolean
}

export const NavButton: FC<NavButtonProps> = ({
  label,
  Icon,
  to,
  color,
  gradient,
  onClick = () => {},
  size = "xl",
  small = false,
}) => {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        minHeight: 60,
        padding: theme.spacing.xs,
        borderRadius: theme.radius.md,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        overflow: "hidden",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
      component={Link}
      to={to}
      onClick={onClick}
    >
      <Group position="apart" noWrap>
        <Group spacing="xl" noWrap>
          {Icon ? (
            <ThemeIcon
              variant={gradient ? "gradient" : "filled"}
              gradient={gradient ?? undefined}
              color={gradient ? undefined : color ?? "blue"}
              size={size}
              radius="xl"
            >
              {Icon}
            </ThemeIcon>
          ) : (
            <Avatar radius="xl">{label?.substring(0, 2).toUpperCase()}</Avatar>
          )}
          {!small && (
            <Text size="sm" style={{ whiteSpace: "nowrap" }}>
              {label}
            </Text>
          )}
        </Group>
        {!small && <ChevronRight />}
      </Group>
    </UnstyledButton>
  )
}
