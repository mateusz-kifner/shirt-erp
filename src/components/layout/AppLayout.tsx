import { AppShell, MantineTheme } from "@mantine/core"
import { ReactNode } from "react"

import Navigation from "./Navigation"
import Header from "./Header"
import AdvancedNavigation from "./AdvancedNavigation"
import { useAuthContext } from "../../context/authContext"
import { useExperimentalFuturesContext } from "../../context/experimentalFuturesContext"
import Login from "../../page-components/Login"

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthContext()
  const { advancedNavigation } = useExperimentalFuturesContext()

  return (
    <AppShell
      style={{ height: "100%" }}
      padding={0}
      navbarOffsetBreakpoint="md"
      fixed
      header={<Header />}
      navbar={advancedNavigation ? <AdvancedNavigation /> : <Navigation />}
      styles={(theme: MantineTheme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors[theme.primaryColor][0],
          overflowX: "hidden",
        },
      })}
    >
      {isAuthenticated ? children : <Login />}
    </AppShell>
  )
}

export default AppLayout
