import { forwardRef, useState } from "react"
import {
  Avatar,
  ColorScheme,
  Container,
  Group,
  Modal,
  Paper,
  Select,
  Text,
  TextInput,
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
import Button from "../../../components/basic/Button"
import DisplayCell from "../../../components/basic/DisplayCell"

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
      <div className="flex flex-row gap-3 flex-nowrap">
        <Avatar src={image} />

        <div>
          <Text size="sm">{label}</Text>
        </div>
      </div>
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

  return (
    <Container size="xs" px="xs" my="xl">
      <Modal
        opened={testFormVisible}
        onClose={() => setTestFormVisible(false)}
        size="xl"
      >
        <div className="flex flex-col gap-3">
          <DisplayCell
            leftSection={<Bug />}
            rightSection={<Bug />}
            label="Test Label"
          >
            <div>test</div>
          </DisplayCell>
          <TextInput icon={<Bug />} label={"Test Label"} />
        </div>
        {/* <Editable
          template={template}
          data={testData}
          onSubmit={(key, val) => {
            console.log("Sublmit", key, " ", val)
            showNotification({
              message: key + ": " + JSON.stringify(val),
            })
          }}
        /> */}
      </Modal>
      <Paper shadow="xs" p="xl" withBorder>
        <div className="flex flex-row gap-3">
          <Button
            style={{ width: "100%", color: "#fff" }}
            onClick={() => {
              signOut()
            }}
            leftSection={<Logout />}
          >
            Wyloguj
          </Button>
          <div className="flex flex-row gap-3 w-full">
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
          </div>
          <Button
            style={{ width: "100%", color: "#fff" }}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
            leftSection={colorScheme === "dark" ? <Sun /> : <MoonStars />}
          >
            {colorScheme === "dark" ? "Jasna skórka" : "Ciemna skórka"}
          </Button>
          <NextLink
            href="/erp/workstations"
            passHref
            style={{ display: "contents" }}
          >
            <Button
              style={{ width: "100%", color: "#fff" }}
              leftSection={<Affiliate />}
            >
              Ustawienia Produkcji
            </Button>
          </NextLink>
          <Button
            style={{ width: "100%", color: "#fff" }}
            onClick={() => {
              toggleDebug()
            }}
            leftSection={<Bug />}
          >
            Debug {debug ? "ON" : "OFF"}
          </Button>
          {debug && (
            <div className="flex flex-col gap-3 w-full">
              <Button
                style={{ width: "100%", color: "#fff" }}
                onClick={() => {
                  setTestFormVisible(true)
                }}
                color="yellow"
                leftSection={<Logout />}
              >
                Open Test
              </Button>
              <Button
                style={{ width: "100%", color: "#fff" }}
                onClick={() => {
                  toggleAdvancedNavigation()
                }}
                color="red"
                leftSection={<Bug />}
              >
                Experimental Navigation {advancedNavigation ? "ON" : "OFF"}
              </Button>
              <Button
                style={{ width: "100%", color: "#fff" }}
                onClick={() => {
                  toggleSearch()
                }}
                color="red"
                leftSection={<Bug />}
              >
                Experimental Search {search ? "ON" : "OFF"}
              </Button>
              <Text>{i18n.language}</Text>
            </div>
          )}
        </div>
      </Paper>
    </Container>
  )
}

export default SettingsPage
