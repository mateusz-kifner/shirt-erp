import {
  ActionIcon,
  AppShell,
  Autocomplete,
  Burger,
  ColorScheme,
  ColorSchemeProvider,
  DefaultMantineColor,
  Group,
  Header,
  Image,
  MantineProvider,
  MantineTheme,
  MediaQuery,
  Navbar,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core"
import { useColorScheme, useHotkeys, useLocalStorage } from "@mantine/hooks"
import { ModalsProvider } from "@mantine/modals"
import { NotificationsProvider } from "@mantine/notifications"
import { FC, ReactElement, useState } from "react"
import { Link, BrowserRouter as Router } from "react-router-dom"
import { Bell, Search, Settings } from "tabler-icons-react"
import Routes, { navigationData } from "./Routes"

const App: FC = ({ children }) => {
  const [opened, setOpened] = useState(false)
  const theme = useMantineTheme()
  const preferredColorScheme = useColorScheme()

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
  })

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"))

  useHotkeys([["mod+J", () => toggleColorScheme()]])

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme: colorScheme,
        }}
        styles={{
          Title: (theme) => ({
            root: {
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.gray[3]
                  : theme.colors.dark[5],
            },
          }),
          Text: (theme) => ({
            root: {
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.gray[3]
                  : theme.colors.dark[5],
            },
          }),
        }}
      >
        <NotificationsProvider>
          <ModalsProvider>
            <Router>
              <AppShell
                style={{ height: "100%" }}
                padding={0}
                navbarOffsetBreakpoint="sm"
                fixed
                navbar={
                  <Navbar
                    hiddenBreakpoint="sm"
                    hidden={!opened}
                    width={{ base: "100%", sm: 300 }}
                    p="sm"
                  >
                    {navigationData.map((val) => (
                      <NavButton {...val} key={"navbar_" + val.label} />
                    ))}
                    {/* <ActionIcon
                variant="outline"
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
              >
                {colorScheme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <MoonStars size={18} />
                )}
              </ActionIcon> */}
                  </Navbar>
                  // </MediaQuery>
                }
                header={
                  <Header height={60} p="xs">
                    <MediaQuery largerThan="sm" styles={{ padding: "0 2rem" }}>
                      <Group
                        position="apart"
                        align="center"
                        style={{ height: "100%" }}
                      >
                        <Group>
                          <MediaQuery
                            largerThan="sm"
                            styles={{ display: "none" }}
                          >
                            <Burger
                              opened={opened}
                              onClick={() => setOpened((o) => !o)}
                              size="sm"
                              color={theme.colors.gray[4]}
                              mr="sm"
                            />
                          </MediaQuery>
                          <Image
                            src="logo.png"
                            alt="Shirt Dip ERP"
                            height={40}
                            style={{
                              filter: `invert(${
                                +!(colorScheme === "dark") * 0.8
                              })`,
                            }}
                          />
                        </Group>
                        <MediaQuery
                          smallerThan="sm"
                          styles={{ display: "none" }}
                        >
                          <Autocomplete
                            placeholder="Search"
                            radius="xl"
                            size="md"
                            disabled
                            icon={<Search />}
                            data={[]}
                            style={{
                              flexGrow: 1,
                              marginLeft: "10vw",
                              marginRight: "10vw",
                            }}
                          />
                        </MediaQuery>
                        <Group>
                          <MediaQuery
                            largerThan="sm"
                            styles={{ display: "none" }}
                          >
                            <ActionIcon
                              size="lg"
                              radius="xl"
                              variant="default"
                              disabled
                            >
                              <Search />
                            </ActionIcon>
                          </MediaQuery>
                          <ActionIcon
                            size="lg"
                            radius="xl"
                            variant="default"
                            disabled
                          >
                            <Bell />
                          </ActionIcon>
                          <ActionIcon
                            size="lg"
                            radius="xl"
                            variant="default"
                            component={Link}
                            to="settings"
                          >
                            <Settings />
                          </ActionIcon>
                        </Group>
                      </Group>
                    </MediaQuery>
                  </Header>
                }
                styles={(theme: MantineTheme) => ({
                  main: {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[8]
                        : theme.colors.gray[0],
                    height: "calc(100vh - var(--mantine-header-height, 0px))",
                  },
                })}
              >
                <Routes />
              </AppShell>
            </Router>
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

const NavButton: FC<{
  label: String
  icon: ReactElement<any, any>
  to: any
  color?: DefaultMantineColor
}> = ({ label, icon, to, color = "blue" }) => {
  return (
    <UnstyledButton
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
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  )
}

export default App
