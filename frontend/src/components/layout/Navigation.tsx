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
// import { navigationData } from "../../Routes"
import { ChevronRight, ChevronLeft } from "../../utils/TablerIcons"

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

  return null
  // <Navbar
  //   hiddenBreakpoint="sm"
  //   hidden={!opened}
  //   width={{ base: "100%", sm: navSmall ? 75 : 300 }}
  //   px="sm"
  // >
  //   <ScrollArea>
  //     <Stack
  //       m={0}
  //       py="md"
  //       justify="space-between"
  //       style={{
  //         minHeight: "calc(100vh - var(--mantine-header-height))",
  //       }}
  //     >
  //       <Stack>
  //         {navigationData.map((val, index) => (
  //           <NavButton
  //             {...val}
  //             key={"navbar_" + val.label}
  //             onClick={(e: any) => {
  //               setOpened && setOpened(false)
  //             }}
  //             small={navSmall && biggerThanSM}
  //           />
  //         ))}
  //       </Stack>
  //       {biggerThanSM && (
  //         <Box
  //           sx={(theme) => ({
  //             paddingTop: theme.spacing.md,
  //             borderTop: `1px solid ${
  //               theme.colorScheme === "dark"
  //                 ? theme.colors.dark[4]
  //                 : theme.colors.gray[2]
  //             }`,
  //           })}
  //         >
  //           <Group position="center">
  //             <ActionIcon
  //               size="xl"
  //               radius="xl"
  //               onClick={() => setNavSmall((val) => !val)}
  //             >
  //               {navSmall ? <ChevronRight /> : <ChevronLeft />}
  //             </ActionIcon>
  //           </Group>
  //         </Box>
  //       )}
  //     </Stack>
  //   </ScrollArea>
  // </Navbar>
}

export const NavButton: FC<{
  label: string
  icon: ReactElement
  to: any
  color?: DefaultMantineColor
  onClick: (e: SyntheticEvent) => void
  small?: boolean
  buttonRef?: Ref<HTMLAnchorElement>
}> = ({
  label,
  icon,
  to,
  color = "blue",
  onClick = () => {},
  small = false,
  buttonRef,
}) => {
  // console.log(small)
  return (
    <UnstyledButton
      ref={buttonRef}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
      component={Link}
      to={to}
      onClick={onClick}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        {!small && <Text size="sm">{label}</Text>}
      </Group>
    </UnstyledButton>
  )
}

export default Navigation
