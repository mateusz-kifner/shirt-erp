import { FC, useState } from "react"
import {
  Button,
  ColorScheme,
  Container,
  Group,
  Modal,
  Paper,
  Stack,
} from "@mantine/core"
import { Affiliate, Bug, Logout, MoonStars, Sun } from "tabler-icons-react"
import template from "../../../models/test.model.json"
import Editable from "../../../components/editable/Editable"
import { showNotification } from "@mantine/notifications"
import { useLocalStorage, useColorScheme } from "@mantine/hooks"
import { NextLink } from "@mantine/next"
import { useAuthContext } from "../../../context/authContext"
import { useExperimentalFuturesContext } from "../../../context/experimentalFuturesContext"

const testData = {
  name: "string",
  bool: true,
  switch: false,
  category: "option 1",
  color: { name: "Red", hex: "#ff0000" },
  date: "2021-11-05T12:24:05.097Z",
  datetime: "2021-11-05T12:24:05.097Z",
  product: null,
  client: null,
  productComponent: null,
  productComponents: [],
  image: null,
  file: null,
  files: null,
  workstations: null,
  employee: null,
  employees: null,
  submit: null,
}

const SettingsPage: FC = () => {
  const { debug, toggleDebug, signOut } = useAuthContext()
  const { toggleSearch, toggleAdvancedNavigation, search, advancedNavigation } =
    useExperimentalFuturesContext()
  const [testFormVisible, setTestFormVisible] = useState(false)
  const preferredColorScheme = useColorScheme()

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
  })
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"))

  return (
    <Container size="xs" px="xs" my="xl">
      <Modal
        opened={testFormVisible}
        onClose={() => setTestFormVisible(false)}
        size="xl"
      >
        <Editable
          template={template}
          data={testData}
          onSubmit={(key, val) => {
            console.log("Sublmit", key, " ", val)
            showNotification({
              message: key + ": " + JSON.stringify(val),
            })
          }}
        />
      </Modal>
      <Paper shadow="xs" p="xl" withBorder>
        <Group>
          <Button
            style={{ width: "100%", color: "#fff" }}
            onClick={() => {
              signOut()
            }}
          >
            <Group>
              <Logout />
              Wyloguj
            </Group>
          </Button>
          <Button
            style={{ width: "100%", color: "#fff" }}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
          >
            <Group>
              {colorScheme === "dark" ? (
                <>
                  <Sun size={18} />
                  Jasna skórka
                </>
              ) : (
                <>
                  <MoonStars size={18} />
                  Ciemna skórka
                </>
              )}
            </Group>
          </Button>
          <Button
            style={{ width: "100%", color: "#fff" }}
            component={NextLink}
            href={"/erp/workstations"}
          >
            <Group>
              <Affiliate />
              Ustawienia Produkcji
            </Group>
          </Button>
          <Button
            style={{ width: "100%", color: "#fff" }}
            onClick={() => {
              toggleDebug()
            }}
          >
            <Group>
              <Bug />
              Debug {debug ? "ON" : "OFF"}
            </Group>
          </Button>
          {debug && (
            <Stack style={{ width: "100%" }}>
              <Button
                style={{ width: "100%", color: "#fff" }}
                onClick={() => {
                  setTestFormVisible(true)
                }}
                color="yellow"
              >
                <Group>
                  <Logout />
                  Open Test
                </Group>
              </Button>
              <Button
                style={{ width: "100%", color: "#fff" }}
                onClick={() => {
                  toggleAdvancedNavigation()
                }}
                color="red"
              >
                <Group>
                  <Bug />
                  Experimental Navigation {advancedNavigation ? "ON" : "OFF"}
                </Group>
              </Button>
              <Button
                style={{ width: "100%", color: "#fff" }}
                onClick={() => {
                  toggleSearch()
                }}
                color="red"
              >
                <Group>
                  <Bug />
                  Experimental Search {search ? "ON" : "OFF"}
                </Group>
              </Button>
            </Stack>
          )}
        </Group>
      </Paper>
    </Container>
  )
}

export default SettingsPage
