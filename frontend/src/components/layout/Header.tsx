import {
  MediaQuery,
  Group,
  Burger,
  Image,
  Autocomplete,
  ActionIcon,
  Header as MantineHeader,
  useMantineTheme,
  MantineTheme,
} from "@mantine/core"
import { FC } from "react"
import { Link } from "react-router-dom"
import { Bell, Search, Settings } from "../../utils/TablerIcons"

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

interface HeaderProps {
  navOpened?: boolean
  setNavOpened?: React.Dispatch<React.SetStateAction<boolean>>
}

const Header: FC<HeaderProps> = ({ navOpened, setNavOpened }) => {
  const theme = useMantineTheme()
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
      <MediaQuery largerThan="sm" styles={{ padding: "0 2rem" }}>
        <Group position="apart" align="center" style={{ height: "100%" }}>
          <Group>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={navOpened ? navOpened : false}
                onClick={() => setNavOpened && setNavOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[4]}
                mr="sm"
              />
            </MediaQuery>
            <Image
              src="/assets/logo_small.png"
              alt="Shirt Dip ERP"
              height={32}
              // style={{
              //   filter: `invert(${
              //     +!(colorScheme === "dark") * 0.8
              //   })`,
              // }}
            />
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
              disabled
              color={theme.colorScheme === "dark" ? "gray" : "dark"}
              variant={theme.colorScheme === "dark" ? "default" : "filled"}
              styles={ActionButtonHeaderStyle}
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
              styles={ActionButtonHeaderStyle}
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
