import { FC, useState } from "react"
import {
  Button,
  ColorScheme,
  Container,
  Group,
  Paper,
  Text,
  ThemeIcon,
} from "@mantine/core"
import { Bug, Logout, MoonStars, Sun } from "tabler-icons-react"
import { loginState } from "../../atoms/loginState"
import { UserType } from "../../types/UserType"
import { useRecoilState } from "recoil"
import { useColorScheme, useLocalStorage } from "@mantine/hooks"
import { useModals } from "@mantine/modals"
import ApiEntryAdd from "../../components/api/ApiEntryAdd"
import test_schema from "../../schemas/test.schema.json"

const SettingsPage: FC = () => {
  const [login, setLogin] = useRecoilState(loginState)
  const [testFormVisible, setTestFormVisible] = useState(false)
  const modals = useModals()

  const openContextModal = () =>
    modals.openModal({
      title: "Test Form",
      children: <ApiEntryAdd schema={test_schema} />,
      styles: (theme) => ({
        modal: {
          width: 760,
        },
      }),
    })
  return (
    <Container size="xs" px="xs" my="xl">
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
            <>
              <Button
                style={{ width: "100%", color: "#fff" }}
                onClick={() => {
                  openContextModal()
                }}
                color="yellow"
              >
                <Group>
                  <Logout />
                  Open Test Form
                </Group>
              </Button>
            </>
          )}
        </Group>
      </Paper>
    </Container>
  )
}

export default SettingsPage
