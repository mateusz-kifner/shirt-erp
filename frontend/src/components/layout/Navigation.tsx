import {
  Group,
  Box,
  Navbar,
  ScrollArea,
  Stack,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import navigationData from "../../navigationData"
import { ChevronRight, ChevronLeft } from "tabler-icons-react"
import { NavButton } from "./NavButton"
import { useAuthContext } from "../../context/authContext"

interface NavigationProps {}

const Navigation = (props: NavigationProps) => {
  const { navigationCollapsed, toggleNavigationCollapsed, debug } =
    useAuthContext()
  const theme = useMantineTheme()
  const biggerThanSM = useMediaQuery(
    `(min-width: ${theme.breakpoints.md}px)`,
    true
  )

  return (
    <Navbar
      hiddenBreakpoint="md"
      hidden={!navigationCollapsed}
      width={{ base: "100%", md: navigationCollapsed ? 85 : 300 }}
      px="sm"
    >
      <ScrollArea>
        <Stack
          m={0}
          py="md"
          justify="space-between"
          style={{
            minHeight: "calc(100vh - var(--mantine-header-height))",
          }}
        >
          <Stack>
            {navigationData.map(
              (val, index) =>
                (!val?.debug || debug) && (
                  <NavButton
                    {...val}
                    key={"navbar_" + val.label}
                    onClick={(e: any) => {
                      !biggerThanSM && toggleNavigationCollapsed()
                    }}
                    small={navigationCollapsed && biggerThanSM}
                  />
                )
            )}
          </Stack>
          {biggerThanSM && (
            <Box
              sx={(theme) => ({
                paddingTop: theme.spacing.md,
                borderTop: `1px solid ${
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
                }`,
              })}
            >
              <Group position="center">
                <ActionIcon
                  size="xl"
                  radius="xl"
                  onClick={() => {
                    toggleNavigationCollapsed()
                  }}
                >
                  {navigationCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </ActionIcon>
              </Group>
            </Box>
          )}
        </Stack>
      </ScrollArea>
    </Navbar>
  )
}

export default Navigation
