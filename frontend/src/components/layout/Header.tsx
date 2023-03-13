import {
  MediaQuery,
  Group,
  Burger,
  ActionIcon,
  Header as MantineHeader,
  useMantineTheme,
} from "@mantine/core"
import { useSpotlight } from "@mantine/spotlight"
import { IconSearch, IconSettings } from "@tabler/icons-react"
import { NextLink } from "@mantine/next"
import { useAuthContext } from "../../context/authContext"
import { useExperimentalFuturesContext } from "../../context/experimentalFuturesContext"
import Notifications from "../Notifications"

interface HeaderProps {}

const Header = (props: HeaderProps) => {
  const { toggleNavigationCollapsed, navigationCollapsed } = useAuthContext()
  const { search } = useExperimentalFuturesContext()
  const theme = useMantineTheme()
  const spotlight = useSpotlight()

  return (
    <MantineHeader
      height={60}
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
        <Group
          position="apart"
          align="center"
          style={{ height: "100%", flexWrap: "nowrap" }}
          p={0}
        >
          <Group style={{ width: navigationCollapsed ? 85 - 13 : 300 - 13 }}>
            <MediaQuery largerThan="md" styles={{ display: "none" }}>
              <Burger
                opened={navigationCollapsed ?? false}
                onClick={() => toggleNavigationCollapsed()}
                size="sm"
                color={theme.colors.gray[4]}
                mr="sm"
              />
            </MediaQuery>
            <MediaQuery smallerThan="md" styles={{ display: "none" }}>
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
            </MediaQuery>
          </Group>
          <div id="HeaderTabs" style={{ flexGrow: 1, height: "100%" }}></div>
          <Group style={{ minWidth: "160px" }} position="right">
            <ActionIcon
              size="lg"
              radius="xl"
              color={theme.colorScheme === "dark" ? "gray" : "dark"}
              variant={theme.colorScheme === "dark" ? "default" : "filled"}
              onClick={spotlight.openSpotlight}
              disabled={!search}
            >
              <IconSearch />
            </ActionIcon>
            <Notifications />
            <ActionIcon
              size="lg"
              radius="xl"
              component={NextLink}
              href="/erp/settings"
              color={theme.colorScheme === "dark" ? "gray" : "dark"}
              variant={theme.colorScheme === "dark" ? "default" : "filled"}
            >
              <IconSettings />
            </ActionIcon>
          </Group>
        </Group>
      </MediaQuery>
    </MantineHeader>
  )
}

export default Header
