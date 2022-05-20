import {
  ActionIcon,
  AppShell,
  Autocomplete,
  Box,
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
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core"
import { useColorScheme, useHotkeys, useLocalStorage } from "@mantine/hooks"
import { NotificationsProvider } from "@mantine/notifications"
import { FC, ReactElement, SyntheticEvent, useEffect, useState } from "react"
import { Link, BrowserRouter as Router } from "react-router-dom"
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  MoonStars,
  Search,
  Settings,
  Sun,
} from "tabler-icons-react"
import Routes, { navigationData } from "./Routes"
import "dayjs/locale/pl"
import { useRecoilState, useRecoilValue } from "recoil"
import { iconState } from "./atoms/iconState"
import axios from "axios"
import { loginState } from "./atoms/loginState"

const ActionButtonHeaderStyle = (theme: MantineTheme) => ({
  root: {
    "&:disabled": {
      backgroundColor:
        theme.colorScheme === "dark" ? undefined : theme.colors.dark[4],
      borderColor: "transparent",
    },
    "&:disabled > svg": {
      stroke: theme.colorScheme === "dark" ? undefined : theme.colors.dark[3],
    },
  },
})

const App: FC = ({ children }) => {
  const [opened, setOpened] = useState(false)
  const [navSmall, setNavSmall] = useLocalStorage<boolean>({
    key: "nav-small",
    defaultValue: false,
  })
  const login = useRecoilValue(loginState)

  const theme = useMantineTheme()
  const preferredColorScheme = useColorScheme()
  const [iconsData, setIconsData] = useRecoilState(iconState)

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
  })
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"))

  useHotkeys([["mod+J", () => toggleColorScheme()]])
  useEffect(() => {
    if (iconsData) return
    axios.get("/icon").then((res: any) => {
      // axios > res_data > strapi_data
      setIconsData(res.data.data)
      console.log(res.data.data)
    })
  }, [])
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme: colorScheme,
          datesLocale: "pl",
          dateFormat: "DD.MM.YYYY",
        }}
        styles={{
          Title: (theme) => ({
            // root: {
            //   color:
            //     theme.colorScheme === "dark"
            //       ? theme.colors.gray[3]
            //       : theme.colors.dark[5],
            // },
          }),
          Text: (theme) => ({
            // root: {
            //   color:
            //     theme.colorScheme === "dark"
            //       ? theme.colors.gray[3]
            //       : theme.colors.dark[5],
            // },
          }),
          // Group: (theme) => ({
          //   root: {

          //   },
          // }),
        }}
      >
        <NotificationsProvider>
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
                  width={{ base: "100%", sm: navSmall ? 75 : 300 }}
                  px="sm"
                  // styles={(theme) => ({
                  //   root: {
                  //     backgroundColor:
                  //       theme.colorScheme === "dark"
                  //         ? theme.colors.dark[7]
                  //         : theme.colors[theme.primaryColor][1],
                  //   },
                  // })}
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
                        {navigationData.map((val) => (
                          <NavButton
                            {...val}
                            key={"navbar_" + val.label}
                            onClick={(e: any) => {
                              setOpened(false)
                            }}
                            small={navSmall}
                          />
                        ))}
                      </Stack>
                      <Box
                        sx={{
                          paddingTop: theme.spacing.md,
                          borderTop: `1px solid ${
                            colorScheme === "dark"
                              ? theme.colors.dark[4]
                              : theme.colors.gray[2]
                          }`,
                        }}
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
                        <MediaQuery
                          smallerThan="sm"
                          styles={{ display: "none" }}
                        >
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
              }
              header={
                <Header
                  height={60}
                  p="xs"
                  styles={(theme) => ({
                    root: {
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[7]
                          : theme.colors.dark[5],
                    },
                  })}
                >
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
                          src="/assets/logo_small.png"
                          alt="Shirt Dip ERP"
                          height={32}
                          // style={{
                          //   filter: `invert(${
                          //     +!(colorScheme === "dark") * 0.8
                          //   })`,
                          // }}
                        />
                      </Group>
                      <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                        <Autocomplete
                          placeholder="Search"
                          radius="xl"
                          size="md"
                          disabled
                          icon={<Search />}
                          data={["test", "test2", "test3", "test4"]}
                          style={{
                            flexGrow: 1,
                            marginLeft: "10vw",
                            marginRight: "10vw",
                          }}
                          styles={(theme) => ({
                            root: {},
                            input: {
                              backgroundColor:
                                theme.colorScheme === "dark"
                                  ? undefined
                                  : theme.colors.dark[4],
                              borderColor: "transparent",
                              color:
                                theme.colorScheme === "dark"
                                  ? undefined
                                  : "#fff",
                              "&:disabled": {
                                backgroundColor:
                                  theme.colorScheme === "dark"
                                    ? undefined
                                    : theme.colors.dark[4],
                                borderColor: "transparent",
                              },
                            },
                            dropdown: {
                              backgroundColor:
                                theme.colorScheme === "dark"
                                  ? undefined
                                  : theme.colors.dark[4],

                              borderColor:
                                theme.colorScheme === "dark"
                                  ? undefined
                                  : theme.colors.dark[4],
                            },
                            item: {
                              color:
                                theme.colorScheme === "dark"
                                  ? undefined
                                  : "#fff",
                              "&:hover": {
                                backgroundColor:
                                  theme.colorScheme === "dark"
                                    ? undefined
                                    : theme.colors.dark[3],
                              },
                            },
                          })}
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
                            disabled
                            color={colorScheme === "dark" ? "gray" : "dark"}
                            variant={
                              colorScheme === "dark" ? "default" : "filled"
                            }
                            styles={ActionButtonHeaderStyle}
                          >
                            <Search />
                          </ActionIcon>
                        </MediaQuery>
                        <ActionIcon
                          size="lg"
                          radius="xl"
                          disabled
                          color={colorScheme === "dark" ? "gray" : "dark"}
                          variant={
                            colorScheme === "dark" ? "default" : "filled"
                          }
                          styles={ActionButtonHeaderStyle}
                        >
                          <Bell />
                        </ActionIcon>
                        <ActionIcon
                          size="lg"
                          radius="xl"
                          component={Link}
                          to="settings"
                          color={colorScheme === "dark" ? "gray" : "dark"}
                          variant={
                            colorScheme === "dark" ? "default" : "filled"
                          }
                          styles={ActionButtonHeaderStyle}
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
                      : theme.colors[theme.primaryColor][0],
                },
              })}
            >
              <Routes />
            </AppShell>
          </Router>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

const NavButton: FC<{
  label: string
  icon: ReactElement<any, any>
  to: any
  color?: DefaultMantineColor
  onClick: (e: SyntheticEvent) => void
  small?: boolean
}> = ({
  label,
  icon,
  to,
  color = "blue",
  onClick = () => {},
  small = false,
}) => {
  // console.log(small)
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

export default App
