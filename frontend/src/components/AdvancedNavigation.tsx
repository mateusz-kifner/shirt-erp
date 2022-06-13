import { ActionIcon, Box, Group, Paper, Stack, Title } from "@mantine/core"
import React, { FC, ReactNode, useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { ArrowLeft } from "tabler-icons-react"
import { getTransitionStyles } from "../mantine/get-transition-styles"
import { useTransition } from "../mantine/useTransition"
import { navigationData } from "../Routes"
import { Compass } from "../utils/TablerIcons"
import NavBar from "./layout/NavBar"
import { NavButton } from "./layout/NavButton"

const slideRightInverse = {
  in: { transform: "translateX(-100%)" },
  out: { transform: "translateX(0)" },
  common: { transformOrigin: "right" },
  transitionProperty: "transform",
}

interface AdvancedNavigationProps {
  navigation: ReactNode
}

const AdvancedNavigation: FC<AdvancedNavigationProps> = ({ navigation }) => {
  const [showSecondNav, setShowSecondNav] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [navBarIndependent, setNavIndependent] = useState<boolean>(false)
  const [navBarPin1, setNavBarPin1] = useState<boolean>(false)
  const [navBarPin2, setNavBarPin2] = useState<boolean>(false)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
  }, [])

  const { transitionDuration, transitionStatus, transitionTimingFunction } =
    useTransition({
      duration: mounted.current ? 250 : 0,
      exitDuration: mounted.current ? 250 : 0,
      mounted: !showSecondNav,
      timingFunction: "ease-in-out",
    })

  const navWidth =
    (navBarIndependent ? 160 : 80) +
    (navBarPin1 ? 260 : 0) +
    (navBarPin2 ? 260 : 0)

  return (
    <Group spacing={0}>
      <NavBar
        onPin={setNavBarPin1}
        setIndependent={(state) => {
          setNavIndependent(state)
          if (state) {
            setShowSecondNav(false)
          }
        }}
        independent={navBarIndependent}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            "& > *": {
              gridRowStart: "1",
              gridColumnStart: "1",
            },
          }}
        >
          <div>
            <Group p="xs" spacing="xs" noWrap align="center">
              <Box p="xs">
                <Compass size={40} />
              </Box>
              <Title order={3}>Nawigacja</Title>
            </Group>
            <Stack p="xs" spacing="xs">
              <Box
                sx={(theme) => ({
                  borderTop: `1px solid ${
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[4]
                      : theme.colors.gray[2]
                  }`,
                })}
              ></Box>
              {navigationData.map((val, index) => (
                <NavButton
                  {...val}
                  key={"navbar_" + val.label}
                  to={val.to + "?second_nav=1"}
                  // onClick={(e: any) => {

                  //   // e.preventDefault()
                  //   // !navBarIndependent && setShowSecondNav(true)
                  //   // setOpened && setOpened(false)
                  // }}
                />
              ))}
            </Stack>
          </div>

          <Paper
            radius={0}
            style={getTransitionStyles({
              transition: slideRightInverse,
              duration: transitionDuration,
              state: transitionStatus,
              timingFunction: transitionTimingFunction,
            })}
          >
            <Stack
              p="xs"
              spacing="xs"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
              }}
            >
              <ActionIcon
                variant="hover"
                onClick={() => setShowSecondNav(false)}
              >
                <ArrowLeft size={32} />
              </ActionIcon>
              {navigation}
            </Stack>
          </Paper>
        </Box>
      </NavBar>
      {navBarIndependent && (
        <NavBar
          onPin={setNavBarPin2}
          setIndependent={(state) => {
            setNavIndependent(state)
            if (state === false) {
              setShowSecondNav(true)
              setNavBarPin2(false)
            }
          }}
          independent={navBarIndependent}
          sx={{
            left: navBarPin1 ? 340 : 80,
            zIndex: 1000,
          }}
        >
          <Stack p="xs" spacing="xs">
            <ActionIcon variant="hover" onClick={() => setShowSecondNav(false)}>
              <ArrowLeft size={32} />
            </ActionIcon>
            {navigation}
          </Stack>
        </NavBar>
      )}
      <div style={{ width: navWidth }}></div>
    </Group>
  )
}

export default AdvancedNavigation
