import {
  ActionIcon,
  Box,
  DefaultMantineColor,
  Group,
  MantineGradient,
  Paper,
  Stack,
  Title,
  Transition,
} from "@mantine/core"
import { FC, ReactNode, useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft } from "tabler-icons-react"
import ProductsList from "../pages/erp/products/ProductsList"
import { Compass } from "../utils/TablerIcons"
import { Bell, Checklist, Crown, Mail, Shirt, User } from "../utils/TablerIcons"

import NavBar from "./layout/NavBar"
import { NavButton } from "./layout/NavButton"
import _ from "lodash"
import names from "../models/names.json"
import ClientsList from "../pages/erp/clients/ClientList"
import { TransitionNoUnmount } from "../mantine/TransitionNoUnmount"

const navigationData: {
  label: string
  Icon: ReactNode
  to: string
  entryName: string
  color?: DefaultMantineColor
  gradient?: MantineGradient
  SecondNavigation?: ReactNode
}[] = [
  {
    label: "Zadania",
    Icon: <Checklist size={32} />,
    to: "/erp/tasks",
    entryName: "tasks",
    // color: "green",
    gradient: { from: "teal", to: "lime", deg: 105 },
    SecondNavigation: <ProductsList />,
  },
  {
    label: "Zamówienia",
    Icon: <Crown size={32} />,
    to: "/erp/orders",
    entryName: "orders",
    // color: "blue",
    gradient: { from: "indigo", to: "cyan", deg: 105 },
  },
  {
    label: "Produkty",
    Icon: <Shirt size={32} />,
    to: "/erp/products",
    entryName: "products",
    // color: "orange",
    gradient: { from: "grape", to: "red", deg: 105 },

    SecondNavigation: <ProductsList />,
  },
  {
    label: "Klienci",
    Icon: <User size={32} />,
    to: "/erp/clients",
    entryName: "clients",
    // color: "lime",
    gradient: { from: "orange", to: "gold", deg: 105 },

    SecondNavigation: <ClientsList />,
  },
  {
    label: "Wydatki",
    Icon: <Bell size={32} />,
    to: "/erp/expenses",
    entryName: "expenses",
  },
  {
    label: "Maile",
    Icon: <Mail size={32} />,
    to: "/erp/email-messages",
    entryName: "email",
  },
  {
    label: "Logi",
    Icon: <Bell size={32} />,
    to: "/erp/logs",
    entryName: "logs",
  },
  {
    label: "Zamówienia archiwalne",
    Icon: <Bell size={32} />,
    to: "/erp/orders-archive",
    entryName: "orders-archive",
  },
  {
    label: "Pracownicy",
    Icon: <Bell size={32} />,
    to: "/erp/users",
    entryName: "users",
  },
]

const slideLeft = {
  in: { transform: "translateX(0)" },
  out: { transform: "translateX(100%)" },
  common: { transformOrigin: "right" },
  transitionProperty: "transform",
}

const slideRight = {
  in: { transform: "translateX(0)" },
  out: { transform: "translateX(-100%)" },
  common: { transformOrigin: "right" },
  transitionProperty: "transform",
}

interface AdvancedNavigationProps {
  // navigation: ReactNode
}

const AdvancedNavigation: FC<AdvancedNavigationProps> = ({}) => {
  const [secondNavId, setSecoundNav] = useState<number | null>(null)
  const [showSecondNav, setShowSecondNav] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [navBarIndependent, setNavIndependent] = useState<boolean>(false)
  const [navBarPin1, setNavBarPin1] = useState<boolean>(false)
  const [navBarPin2, setNavBarPin2] = useState<boolean>(false)
  const mounted = useRef(false)
  const navigate = useNavigate()
  useEffect(() => {
    mounted.current = true
  }, [])

  const navWidth =
    (navBarIndependent ? 160 : 80) +
    (navBarPin1 ? 260 : 0) +
    (navBarPin2 ? 260 : 0)

  const navData = secondNavId ? navigationData[secondNavId] : null
  const SecondNav = navData?.SecondNavigation ? navData.SecondNavigation : null

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
        widthFolded={80}
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
          <TransitionNoUnmount
            mounted={!showSecondNav}
            duration={250}
            transition={slideRight}
            timingFunction="ease-in-out"
          >
            {(transitionStyles) => (
              <div style={transitionStyles}>
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
                      onClick={(e: any) => {
                        e.preventDefault()
                        val.SecondNavigation && setSecoundNav(index)
                        !navBarIndependent && setShowSecondNav(true)
                      }}
                    />
                  ))}
                </Stack>
              </div>
            )}
          </TransitionNoUnmount>
          <TransitionNoUnmount
            mounted={showSecondNav}
            duration={250}
            transition={slideLeft}
            timingFunction="ease-in-out"
          >
            {(transitionStyles) => (
              <Paper radius={0} style={transitionStyles}>
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
                  <Group p={4}>
                    <ActionIcon
                      variant="hover"
                      radius="xl"
                      size="xl"
                      onClick={() => setShowSecondNav(false)}
                    >
                      <ArrowLeft size={32} />
                    </ActionIcon>
                    {navData?.entryName && (
                      <Title order={2}>
                        {navData?.entryName in names &&
                          _.capitalize(
                            names[navData.entryName as keyof typeof names]
                              .plural
                          )}
                      </Title>
                    )}
                  </Group>
                  {SecondNav && SecondNav}
                </Stack>
              </Paper>
            )}
          </TransitionNoUnmount>
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
          widthFolded={80}
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
            <Group p={4}>
              <div style={{ width: 44, height: 44 }}></div>
              {navData?.entryName && navData?.entryName in names && (
                <Title order={2}>
                  {_.capitalize(
                    names[navData?.entryName as keyof typeof names].plural
                  )}
                </Title>
              )}
            </Group>
            {SecondNav && SecondNav}
          </Stack>
        </NavBar>
      )}
      <div style={{ width: navWidth }}></div>
    </Group>
  )
}

export default AdvancedNavigation