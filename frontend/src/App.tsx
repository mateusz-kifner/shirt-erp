import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  MantineTheme,
} from "@mantine/core"
import { useColorScheme, useHotkeys, useLocalStorage } from "@mantine/hooks"
import { NotificationsProvider } from "@mantine/notifications"
import { useEffect } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import Routes from "./Routes"
import "dayjs/locale/pl"
import { useRecoilState, useRecoilValue } from "recoil"
import { iconState } from "./atoms/iconState"
import axios from "axios"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import isToday from "dayjs/plugin/isToday"
import Navigation from "./components/layout/Navigation"
import Header from "./components/layout/Header"
import AdvancedNavigation from "./components/layout/AdvancedNavigation"
import { experimentalFuturesState } from "./atoms/experimentalFuturesState"
import Spotlight from "./components/Spotlight"

dayjs.locale("pl")
dayjs.extend(localizedFormat)
dayjs.extend(isToday)

const App = () => {
  const [iconsData, setIconsData] = useRecoilState(iconState)
  const experimentalFutures = useRecoilValue(experimentalFuturesState)

  const preferredColorScheme = useColorScheme()

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
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: colorScheme,
          datesLocale: "pl",
          dateFormat: "DD.MM.YYYY",
        }}
        // styles={{
        //   Title: (theme) => ({
        //     // root: {
        //     //   color:
        //     //     theme.colorScheme === "dark"
        //     //       ? theme.colors.gray[3]
        //     //       : theme.colors.dark[5],
        //     // },
        //   }),
        //   Text: (theme) => ({
        //     // root: {
        //     //   color:
        //     //     theme.colorScheme === "dark"
        //     //       ? theme.colors.gray[3]
        //     //       : theme.colors.dark[5],
        //     // },
        //   }),
        //   // Group: (theme) => ({
        //   //   root: {

        //   //   },
        //   // }),
        // }}
      >
        <NotificationsProvider>
          <Router>
            <Spotlight>
              <AppShell
                style={{ height: "100%" }}
                padding={0}
                navbarOffsetBreakpoint="md"
                fixed
                header={<Header />}
                navbar={
                  experimentalFutures.advanced_navigation ? (
                    <AdvancedNavigation />
                  ) : (
                    <Navigation />
                  )
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
            </Spotlight>
          </Router>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default App
