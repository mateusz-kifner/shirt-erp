import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core"
import { useColorScheme, useHotkeys, useLocalStorage } from "@mantine/hooks"
import { Notifications } from "@mantine/notifications"
import React, { ReactNode } from "react"
import Spotlight from "../../context/Spotlight"
import EnvMessage from "../EnvMessage"
import WelcomeMessage from "../WelcomeMessage"

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

          components: {
            Paper: {
              defaultProps: {
                radius: 4,
              },
            },
            NavLink: {
              defaultProps: {
                sx: {
                  "&:disabled": {
                    opacity: 1,
                    pointerEvents: "auto",
                    userSelect: "text",
                    cursor: "auto",
                  },
                  "&:disabled:hover": {
                    backgroundColor: "transparent",
                  },
                },
              },
            },
            Text: {
              styles: (theme, params: any) => ({
                root: {
                  color:
                    params.color === "dimmed" && theme.colorScheme === "light"
                      ? theme.colors.gray[8]
                      : undefined,
                },
              }),
            },
          },
        }}

        // styles={{
        //   // Title: (theme) => ({
        //   //   // root: {
        //   //   //   color:
        //   //   //     theme.colorScheme === "dark"
        //   //   //       ? theme.colors.gray[3]
        //   //   //       : theme.colors.dark[5],
        //   //   // },
        //   // }),
        //   // Text: (theme) => ({
        //   //   // root: {
        //   //   //   color:
        //   //   //     theme.colorScheme === "dark"
        //   //   //       ? theme.colors.gray[3]
        //   //   //       : theme.colors.dark[5],
        //   //   // },
        //   // }),
        //   // // Group: (theme) => ({
        //   // //   root: {

        //   // //   },
        //   // // }),
        // }}
      >
        <Notifications />
        <Spotlight>
          {children}
          <WelcomeMessage />
          <EnvMessage />
        </Spotlight>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default UIProvider
