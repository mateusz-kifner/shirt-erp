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
import { useRecoilValue } from "recoil"
import { loginState } from "../../atoms/loginState"

interface NavigationProps {
  opened?: boolean
  setOpened?: React.Dispatch<React.SetStateAction<boolean>>
}

const Navigation: FC<NavigationProps> = ({ opened, setOpened }) => {
  const user = useRecoilValue(loginState)
  const biggerThanSM = useMediaQuery("(min-width: 1000px)")
  const [navSmall, setNavSmall] = useLocalStorage<boolean>({
    key: "nav-small",
    defaultValue: false,
  })

  return (
    <Navbar
      hiddenBreakpoint="md"
      hidden={!opened}
      width={{ base: "100%", sm: navSmall ? 85 : 300 }}
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
                      setOpened && setOpened(false)
                    }}
                    small={navSmall && biggerThanSM}
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
                    setNavSmall((val) => !val)
                    setOpened && setOpened((val) => !val)
                  }}
                >
                  {navSmall ? <ChevronRight /> : <ChevronLeft />}
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
