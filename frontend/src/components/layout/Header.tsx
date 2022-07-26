import {
  MediaQuery,
  Group,
  Burger,
  Image,
  ActionIcon,
  Header as MantineHeader,
  useMantineTheme,
  MantineTheme,
} from "@mantine/core"
import { useSpotlight } from "@mantine/spotlight"
import { FC } from "react"
import { Link } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"
import { experimentalFuturesState } from "../../atoms/experimentalFuturesState"
import { Bell, Search, Settings } from "tabler-icons-react"
import { loginState } from "../../atoms/loginState"

const ActionButtonHeaderStyle = (theme: MantineTheme) => ({
  root: {
    "&:disabled": {
      backgroundColor:
        theme.colorScheme === "dark" ? undefined : theme.colors.dark[4],
      borderColor: "transparent",
    },
    "&:disabled > svg": {
      stroke: theme.colorScheme === "dark" ? undefined : theme.colors.dark[3],
    },
  },
})

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const [user, setUser] = useRecoilState(loginState)

  const theme = useMantineTheme()
  const experimentalFutures = useRecoilValue(experimentalFuturesState)
  const spotlight = useSpotlight()

  return (
    <MantineHeader
      height={60}
      p="xs"
      styles={(theme) => ({
        root: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.dark[5],
        },
      })}
    >
      <MediaQuery largerThan="md" styles={{ padding: "0 13px" }}>
        <Group position="apart" align="center" style={{ height: "100%" }}>
          <Group>
            <MediaQuery largerThan="md" styles={{ display: "none" }}>
              <Burger
                opened={user.navigationCollapsed ?? false}
                onClick={() =>
                  setUser((val) => ({
                    ...val,
                    navigationCollapsed: !val.navigationCollapsed,
                  }))
                }
                size="sm"
                color={theme.colors.gray[4]}
                mr="sm"
              />
            </MediaQuery>
            {user.navigationCollapsed ? (
              <img
                src="/assets/logo_micro.png"
                alt="Shirt Dip ERP"
                height={40}
              />
            ) : (
              <img
                src="/assets/logo_small.png"
                alt="Shirt Dip ERP"
                height={40}
              />
            )}
          </Group>
          {/* <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Autocomplete
              placeholder="Search"
              radius="xl"
              size="md"
              disabled
              icon={<Search />}
              data={["test", "test2", "test3", "test4"]}
              style={{
                flexGrow: 1,
                marginLeft: "10vw",
                marginRight: "10vw",
              }}
              styles={(theme) => ({
                root: {},
                input: {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? undefined
                      : theme.colors.dark[4],
                  borderColor: "transparent",
                  color: theme.colorScheme === "dark" ? undefined : "#fff",
                  "&:disabled": {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? undefined
                        : theme.colors.dark[4],
                    borderColor: "transparent",
                  },
                },
                dropdown: {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? undefined
                      : theme.colors.dark[4],

                  borderColor:
                    theme.colorScheme === "dark"
                      ? undefined
                      : theme.colors.dark[4],
                },
                item: {
                  color: theme.colorScheme === "dark" ? undefined : "#fff",
                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? undefined
                        : theme.colors.dark[3],
                  },
                },
              })}
            />
          </MediaQuery> */}
          <Group>
            {/* <MediaQuery largerThan="sm" styles={{ display: "none" }}> */}
            <ActionIcon
              size="lg"
              radius="xl"
              color={theme.colorScheme === "dark" ? "gray" : "dark"}
              variant={theme.colorScheme === "dark" ? "default" : "filled"}
              styles={ActionButtonHeaderStyle}
              onClick={spotlight.openSpotlight}
              disabled={!experimentalFutures.search}
            >
              <Search />
            </ActionIcon>
            {/* </MediaQuery> */}
            <ActionIcon
              size="lg"
              radius="xl"
              disabled
              color={theme.colorScheme === "dark" ? "gray" : "dark"}
              variant={theme.colorScheme === "dark" ? "default" : "filled"}
              styles={(theme) => ({})}
            >
              <Bell />
            </ActionIcon>
            <ActionIcon
              size="lg"
              radius="xl"
              component={Link}
              to="/erp/settings"
              color={theme.colorScheme === "dark" ? "gray" : "dark"}
              variant={theme.colorScheme === "dark" ? "default" : "filled"}
              styles={ActionButtonHeaderStyle}
            >
              <Settings />
            </ActionIcon>
          </Group>
        </Group>
      </MediaQuery>
    </MantineHeader>
  )
}

export default Header
