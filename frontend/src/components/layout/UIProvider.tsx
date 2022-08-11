import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core"
import { useColorScheme, useHotkeys, useLocalStorage } from "@mantine/hooks"
import { NotificationsProvider } from "@mantine/notifications"
import React, { ReactNode } from "react"
import Spotlight from "./Spotlight"

const UIProvider = ({ children }: { children: ReactNode }) => {
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
          <Spotlight>{children}</Spotlight>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default UIProvider
