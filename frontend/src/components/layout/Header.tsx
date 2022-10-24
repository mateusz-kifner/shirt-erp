import {
  MediaQuery,
  Group,
  Burger,
  Image,
  ActionIcon,
  Header as MantineHeader,
  useMantineTheme,
  MantineTheme,
  Popover,
  Text,
  Title,
} from "@mantine/core"
import { useSpotlight } from "@mantine/spotlight"
import { FC } from "react"
import { Bell, Search, Settings } from "tabler-icons-react"
import { NextLink } from "@mantine/next"
import { useAuthContext } from "../../context/authContext"
import { useExperimentalFuturesContext } from "../../context/experimentalFuturesContext"

interface HeaderProps {}

const Header = (props: HeaderProps) => {
  const { toggleNavigationCollapsed, navigationCollapsed } = useAuthContext()
  const { search } = useExperimentalFuturesContext()
  const theme = useMantineTheme()
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
                opened={navigationCollapsed ?? false}
                onClick={() => toggleNavigationCollapsed()}
                size="sm"
                color={theme.colors.gray[4]}
                mr="sm"
              />
            </MediaQuery>
            {navigationCollapsed ? (
              // eslint-disable-next-line
              <img
                src="/assets/logo_micro.png"
                alt="Shirt Dip ERP"
                height={40}
              />
            ) : (
              // eslint-disable-next-line
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
              onClick={spotlight.openSpotlight}
              disabled={!search}
            >
              <Search />
            </ActionIcon>
            {/* </MediaQuery> */}
            <Popover
              width={400}
              position="bottom-end"
              arrowOffset={12}
              offset={4}
              withArrow
              shadow="md"
            >
              <Popover.Target>
                <ActionIcon
                  size="lg"
                  radius="xl"
                  color={theme.colorScheme === "dark" ? "gray" : "dark"}
                  variant={theme.colorScheme === "dark" ? "default" : "filled"}
                >
                  <Bell />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown sx={{ pointerEvents: "none" }}>
                <Title order={3}>
                  <Bell size={18} /> Powiadomienia{" "}
                </Title>
                <Text size="sm">Brak powiadomień</Text>
              </Popover.Dropdown>
            </Popover>

            <ActionIcon
              size="lg"
              radius="xl"
              component={NextLink}
              href="/erp/settings"
              color={theme.colorScheme === "dark" ? "gray" : "dark"}
              variant={theme.colorScheme === "dark" ? "default" : "filled"}
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
