import {
  DefaultMantineColor,
  Group,
  ThemeIcon,
  UnstyledButton,
  Text,
  MediaQuery,
  Box,
  Navbar,
  ScrollArea,
  Stack,
  ColorScheme,
  ActionIcon,
} from "@mantine/core"
import { useColorScheme, useLocalStorage } from "@mantine/hooks"
import { FC, ReactElement, Ref, SyntheticEvent, useState } from "react"
import { Link } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { loginState } from "../../atoms/loginState"
import { navigationData } from "../../Routes"
import {
  ChevronRight,
  ChevronLeft,
  Sun,
  MoonStars,
} from "../../utils/TablerIcons"

interface NavigationProps {
  opened?: boolean
  setOpened?: React.Dispatch<React.SetStateAction<boolean>>
}

const Navigation: FC<NavigationProps> = ({ opened, setOpened }) => {
  const [navSmall, setNavSmall] = useLocalStorage<boolean>({
    key: "nav-small",
    defaultValue: false,
  })
  const login = useRecoilValue(loginState)
  const preferredColorScheme = useColorScheme()

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
  })
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"))

  return (
    <Navbar
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ base: "100%", sm: navSmall ? 75 : 300 }}
      px="sm"
    >
      <ScrollArea>
        <Stack
          m={0}
          py="md"
          justify="space-between"
          style={{
            minHeight: "calc(100vh - var(--mantine-header-height))",
          }}
        >
          <Stack>
            {navigationData.map((val, index) => (
              <NavButton
                {...val}
                key={"navbar_" + val.label}
                onClick={(e: any) => {
                  setOpened && setOpened(false)
                }}
                small={navSmall}
              />
            ))}
          </Stack>
          <Box
            sx={(theme) => ({
              paddingTop: theme.spacing.md,
              borderTop: `1px solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
            })}
          >
            <UnstyledButton
              sx={(theme) => ({
                display: "block",
                width: "100%",
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[0]
                    : theme.black,

                "&:hover": {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[6]
                      : theme.colors.gray[0],
                },
              })}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              <Group>
                <ThemeIcon variant="light">
                  {colorScheme === "dark" ? (
                    <Sun size={18} />
                  ) : (
                    <MoonStars size={18} />
                  )}
                </ThemeIcon>
                {!navSmall &&
                  (colorScheme === "dark" ? (
                    <Text size="sm">Jasna skórka</Text>
                  ) : (
                    <Text size="sm">Ciemna skórka</Text>
                  ))}
              </Group>
            </UnstyledButton>
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <Group position="center">
                <ActionIcon
                  size="xl"
                  radius="xl"
                  onClick={() => setNavSmall((val) => !val)}
                >
                  {navSmall ? <ChevronRight /> : <ChevronLeft />}
                </ActionIcon>
              </Group>
            </MediaQuery>
          </Box>
        </Stack>
      </ScrollArea>
    </Navbar>
    // </MediaQuery>
  )
}

export const NavButton: FC<{
  label: string
  icon: ReactElement
  to: any
  color?: DefaultMantineColor
  onClick: (e: SyntheticEvent) => void
  small?: boolean
  buttonRef?: Ref<HTMLAnchorElement>
}> = ({
  label,
  icon,
  to,
  color = "blue",
  onClick = () => {},
  small = false,
  buttonRef,
}) => {
  // console.log(small)
  return (
    <UnstyledButton
      ref={buttonRef}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

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
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        {!small && <Text size="sm">{label}</Text>}
      </Group>
    </UnstyledButton>
  )
}

export default Navigation
