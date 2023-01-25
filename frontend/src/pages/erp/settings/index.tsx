import { forwardRef, useState } from "react"
import {
  Avatar,
  Button,
  ColorScheme,
  Container,
  Group,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core"
import { Affiliate, Bug, Logout, MoonStars, Sun } from "tabler-icons-react"
import template from "../../../models/test.model.json"
import Editable from "../../../components/editable/Editable"
import { showNotification } from "@mantine/notifications"
import { useLocalStorage, useColorScheme } from "@mantine/hooks"
import { NextLink } from "@mantine/next"
import { useAuthContext } from "../../../context/authContext"
import { useExperimentalFuturesContext } from "../../../context/experimentalFuturesContext"
import { useRouter } from "next/router"
import { useTranslation } from "../../../i18n"

const testData = {
  name: "string",
  bool: true,
  switch: false,
  category: "option 1",
  color: "#ff0000",
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

  group: { name: "test", color: "#ff0000" },
  group2: { name: "test", color: "#ff0000" },
  group3: { name: {}, color: "#ff0000" },
  group_of_arrays: { arrayText: [], arrayText2: [] },
}

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string
  label: string
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
)

SelectItem.displayName = "SelectItem"

const SettingsPage = () => {
  const { debug, toggleDebug, signOut } = useAuthContext()
  const router = useRouter()
  const { toggleSearch, toggleAdvancedNavigation, search, advancedNavigation } =
    useExperimentalFuturesContext()
  const [testFormVisible, setTestFormVisible] = useState(false)
  const preferredColorScheme = useColorScheme()

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
  })

  const { t, i18n } = useTranslation()
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"))

  const handleLocaleChange = (value: string) => {
    i18n.changeLanguage(value)
  }

  const [previewOpened, setPreviewOpened] = useState<boolean>(false)
  const [preview, setPreview] = useState<string>("")
  const [active, setActive] = useState<boolean>(false)

  return (
    <Container size="xs" px="xs" my="xl">
      <Modal
        opened={testFormVisible}
        onClose={() => setTestFormVisible(false)}
        size="xl"
      >
        <Button onClick={() => setActive((val) => !val)}>
          {active ? "unlocked" : "locked"}
        </Button>
        <Editable
          template={template}
          data={testData}
          active={active}
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
          <Group style={{ width: "100%" }}>
            <Text style={{ flexGrow: 1 }}>{t("lang")}</Text>

            <Select
              disabled={!debug}
              icon={<Avatar src={`/assets/${i18n.language}.svg`} />}
              iconWidth={50}
              onChange={handleLocaleChange}
              value={i18n.language}
              data={[
                {
                  value: "en",
                  label: "English",

                  image: "/assets/en.svg",
                },
                {
                  value: "pl",
                  label: "Polski",
                  image: "/assets/pl.svg",
                },
              ]}
              itemComponent={SelectItem}
            />
          </Group>
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
              <Text>{i18n.language}</Text>
            </Stack>
          )}
        </Group>
      </Paper>
    </Container>
  )
}

export default SettingsPage
