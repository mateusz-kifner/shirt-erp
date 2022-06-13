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
import { Affiliate, Bug, Logout, MoonStars, Sun } from "../../utils/TablerIcons"
import { loginState } from "../../atoms/loginState"
import { useRecoilState } from "recoil"
import template from "../../models/test.model.json"
import Editable from "../../components/editable/Editable"
import { showNotification } from "@mantine/notifications"
import { Link } from "react-router-dom"
import { useLocalStorage, useColorScheme } from "@mantine/hooks"

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
  const [login, setLogin] = useRecoilState(loginState)
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
              setLogin({ jwt: "", user: null, debug: false })
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
            component={Link}
            to={"/erp/workstations"}
          >
            <Group>
              <Affiliate />
              Ustawienia Produkcji
            </Group>
          </Button>
          <Button
            style={{ width: "100%", color: "#fff" }}
            onClick={() => {
              setLogin((user) => ({
                ...user,
                debug: !user.debug,
              }))
            }}
          >
            <Group>
              <Bug />
              Debug {login.debug ? "ON" : "OFF"}
            </Group>
          </Button>
          {login.debug && (
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
            </Stack>
          )}
        </Group>
      </Paper>
    </Container>
  )
}

export default SettingsPage
