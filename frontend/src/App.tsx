import {
  ActionIcon,
  AppShell,
  Autocomplete,
  Burger,
  ColorScheme,
  ColorSchemeProvider,
  Group,
  Image,
  MantineProvider,
  MantineTheme,
  MediaQuery,
  useMantineTheme,
} from "@mantine/core"
import { useColorScheme, useHotkeys, useLocalStorage } from "@mantine/hooks"
import { NotificationsProvider } from "@mantine/notifications"
import { useEffect, useState } from "react"
import { Link, BrowserRouter as Router } from "react-router-dom"
import { Bell, Search, Settings } from "./utils/TablerIcons"
import Routes from "./Routes"
import "dayjs/locale/pl"
import { useRecoilState } from "recoil"
import { iconState } from "./atoms/iconState"
import axios from "axios"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import isToday from "dayjs/plugin/isToday"
import Navigation from "./components/layout/Navigation"
import Header from "./components/layout/Header"

dayjs.locale("pl")
dayjs.extend(localizedFormat)
dayjs.extend(isToday)

const App = () => {
  const [opened, setOpened] = useState<boolean>(false)

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
            {/* <Button
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                zIndex: showTabNav ? 1000 : 0,
              }}
              tabIndex={0}
              onFocus={() => setShowTabNav(true)}
              onBlur={() => setShowTabNav(false)}
              onClick={() => {
                navbarRef.current && navbarRef.current.focus()
              }}
            >
              Idź do nawigacji
            </Button> */}
            <AppShell
              style={{ height: "100%" }}
              padding={0}
              navbarOffsetBreakpoint="sm"
              fixed
              navbar={<Navigation opened={opened} setOpened={setOpened} />}
              header={<Header navOpened={opened} setNavOpened={setOpened} />}
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

export default App
