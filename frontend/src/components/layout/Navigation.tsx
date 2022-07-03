import {
  DefaultMantineColor,
  Group,
  ThemeIcon,
  UnstyledButton,
  Text,
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
import { ChevronRight, ChevronLeft } from "../../utils/TablerIcons"
import { NavButton } from "./NavButton"

interface NavigationProps {
  opened?: boolean
  setOpened?: React.Dispatch<React.SetStateAction<boolean>>
}

const Navigation: FC<NavigationProps> = ({ opened, setOpened }) => {
  const biggerThanSM = useMediaQuery("(min-width: 800px)")
  const [navSmall, setNavSmall] = useLocalStorage<boolean>({
    key: "nav-small",
    defaultValue: false,
  })

  return (
    <Navbar
      hiddenBreakpoint="sm"
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
            {navigationData.map((val, index) => (
              <NavButton
                {...val}
                key={"navbar_" + val.label}
                onClick={(e: any) => {
                  setOpened && setOpened(false)
                }}
                small={navSmall && biggerThanSM}
              />
            ))}
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
