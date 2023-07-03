import {
  Group,
  Box,
  Navbar,
  ScrollArea,
  Stack,
  ActionIcon,
  useMantineTheme,
  Button,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import navigationData from "../../navigationData"
import {
  IconChevronRight,
  IconChevronLeft,
  IconCategory,
  IconChartTreemap,
} from "@tabler/icons-react"
import { NavButton } from "./NavButton"
import { useAuthContext } from "../../context/authContext"
import { useRouter } from "next/router"
import { Children, ReactNode, useEffect, useState } from "react"
import { has } from "lodash"

interface NavigationProps {}

const Navigation = (props: NavigationProps) => {
  const {
    navigationCollapsed,
    toggleNavigationCollapsed,
    debug,
    isSmall,
    hasTouch,
  } = useAuthContext()
  const router = useRouter()
  const theme = useMantineTheme()
  const biggerThanSM = useMediaQuery(
    `(min-width: ${theme.breakpoints.md}px)`,
    true
  )
  const [activeTab, setActiveTab] = useState<number>(0)

  return (
    <Navbar
      hiddenBreakpoint="md"
      hidden={!navigationCollapsed}
      width={{ base: "100%", md: navigationCollapsed ? 85 : 300 }}
      px="sm"
    >
      {(hasTouch || isSmall) && (
        <Stack py="md" align="center">
          <Button.Group>
            <Button
              variant="default"
              // style={{ flexGrow: 1 }}
              onClick={() => setActiveTab(0)}
              radius={999999}
              disabled={activeTab === 0}
              size="xl"
            >
              <IconCategory />
            </Button>
            <Button
              variant="default"
              // style={{ flexGrow: 1 }}
              onClick={() => setActiveTab(1)}
              radius={999999}
              disabled={activeTab === 1}
              size="xl"
            >
              <IconChartTreemap />
            </Button>
          </Button.Group>
        </Stack>
      )}
      <ScrollArea>
        <Stack
          m={0}
          py="md"
          justify="space-between"
          style={{
            minHeight: "calc(100vh - var(--mantine-header-height))",
          }}
        >
          <Stack
            style={{
              display:
                (isSmall || hasTouch) && activeTab !== 0 ? "none" : undefined,
            }}
          >
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
          </Stack>
          <Stack
            id="SpecialMenu"
            style={{
              display: activeTab !== 1 ? "none" : undefined,
            }}
          ></Stack>
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
                  {navigationCollapsed ? (
                    <IconChevronRight />
                  ) : (
                    <IconChevronLeft />
                  )}
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
