import {
  Group,
  Box,
  Navbar,
  ScrollArea,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import navigationData from "../../navigationData"
import { ChevronRight, ChevronLeft } from "tabler-icons-react"
import { NavButton } from "./NavButton"
import { useAuthContext } from "../../context/authContext"
import { useRouter } from "next/router"

interface NavigationProps {}

const Navigation = (props: NavigationProps) => {
  const { navigationCollapsed, toggleNavigationCollapsed, debug } =
    useAuthContext()

  const router = useRouter()
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
        <div
          className="flex flex-col gap-3 m-0 py-2 justify-between"
          style={{
            minHeight: "calc(100vh - var(--mantine-header-height))",
          }}
        >
          <div className="flex flex-col gap-3">
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
                    active={val.entryName === router.pathname.split("/")[2]}
                  />
                )
            )}
          </div>
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
              <div className="flex flex-row gap-3 justify-between">
                <ActionIcon
                  size="xl"
                  radius="xl"
                  onClick={() => {
                    toggleNavigationCollapsed()
                  }}
                >
                  {navigationCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </ActionIcon>
              </div>
            </Box>
          )}
        </div>
      </ScrollArea>
    </Navbar>
  )
}

export default Navigation
