import { cloneElement, ReactNode, Ref, SyntheticEvent } from "react"

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
import { IconChevronRight } from "@tabler/icons-react"
import Link from "next/link"

interface NavButtonProps {
  label: string
  Icon?: ReactNode
  to: any
  color?: DefaultMantineColor
  gradient?: MantineGradient
  onClick?: (e: SyntheticEvent) => void
  size?: MantineNumberSize
  small?: boolean
  active?: boolean
}

export const NavButton = ({
  label,
  Icon,
  to,
  color,
  gradient,
  onClick = () => {},
  size = "xl",
  small = false,
  active = false,
}: NavButtonProps) => {
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
        backgroundColor: active
          ? theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0]
          : undefined,
        overflow: "hidden",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
      component={Link}
      href={to}
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
        {!small && (
          <IconChevronRight
            style={{
              transform: active ? "translate(2px,0)" : "translate(-2px,0)",
            }}
          />
        )}
      </Group>
    </UnstyledButton>
  )
}
