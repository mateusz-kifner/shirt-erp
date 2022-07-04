import {
  Group,
  Box,
  Navbar,
  ScrollArea,
  Stack,
  ActionIcon,
} from "@mantine/core"
import { useLocalStorage, useMediaQuery } from "@mantine/hooks"
import { FC, ReactElement, Ref, SyntheticEvent, useState } from "react"
import { Link } from "react-router-dom"
import navigationData from "../../navigationData"
// import { navigationData } from "../../Routes"
import { ChevronRight, ChevronLeft } from "tabler-icons-react"
import { NavButton } from "./NavButton"
import { useRecoilState, useRecoilValue } from "recoil"
import { loginState } from "../../atoms/loginState"

interface NavigationProps {}

const Navigation: FC<NavigationProps> = () => {
  const [user, setUser] = useRecoilState(loginState)
  const biggerThanSM = useMediaQuery("(min-width: 1000px)")

  return (
    <Navbar
      hiddenBreakpoint="md"
      hidden={!user.navigationCollapsed}
      width={{ base: "100%", md: user.navigationCollapsed ? 85 : 300 }}
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
                (!val?.debug || user.debug) && (
                  <NavButton
                    {...val}
                    key={"navbar_" + val.label}
                    onClick={(e: any) => {
                      !biggerThanSM &&
                        setUser((val) => ({
                          ...val,
                          navigationCollapsed: !val.navigationCollapsed,
                        }))
                    }}
                    small={user.navigationCollapsed && biggerThanSM}
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
                    setUser((val) => ({
                      ...val,
                      navigationCollapsed: !val.navigationCollapsed,
                    }))
                  }}
                >
                  {user.navigationCollapsed ? (
                    <ChevronRight />
                  ) : (
                    <ChevronLeft />
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
