import { FC, useEffect, useMemo, useState } from "react"
import { Button, Container, Group, Modal, Paper, Stack } from "@mantine/core"
import { Bug, Logout } from "../../../utils/TablerIcons"
import { loginState } from "../../../atoms/loginState"
import { useRecoilState } from "recoil"
import ApiEntryAdd from "../../../components/api/ApiEntryAdd"
import testSchema from "../../../schemas/test.schema.json"
import FileButton from "../../../components/FileButton"
import FileList from "../../../components/FileList"
import TestTable from "../../../components/TestTable"
import ApiEntryDetails from "../../../components/api/ApiEntryDetails"
import RichTextEditor from "@mantine/rte"

const SettingsPage: FC = () => {
  const [login, setLogin] = useRecoilState(loginState)
  const [testFormVisible, setTestFormVisible] = useState(false)
  const [val, setVal] = useState("")

  return (
    <Container size="xs" px="xs" my="xl">
      <Modal
        opened={testFormVisible}
        onClose={() => setTestFormVisible(false)}
        size="xl"
      >
        <ApiEntryAdd schema={testSchema} entryName="products" />
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
                  Open Test Form
                </Group>
              </Button>
              <FileButton disabled />
              <FileList maxFileCount={1000} />
              {/* <TestTable /> */}
              {/* <ApiEntryDetails /> */}
              <RichTextEditor value={val} onChange={setVal} />
              <div style={{ minHeight: 1000 }}></div>
            </Stack>
          )}
        </Group>
      </Paper>
    </Container>
  )
}

export default SettingsPage
