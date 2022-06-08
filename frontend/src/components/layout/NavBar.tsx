import { ActionIcon, Box, Paper, ScrollArea, Stack, Sx } from "@mantine/core"
import { FC, ReactNode, SyntheticEvent, useState } from "react"
import { PinnedOff, Pinned } from "../../utils/TablerIcons"

interface NavBarProps {
  children: ReactNode
  sx?: Sx
  onPin?: (pinned: boolean) => void
  widthFolded?: number
  width?: number
  independent?: boolean
  setIndependent?: (independent: boolean) => void
  ref?: React.MutableRefObject<any>
}

const NavBar: FC<NavBarProps> = ({
  children,
  sx,
  onPin,
  widthFolded = 80,
  width = 340,
  independent = false,
  setIndependent,
}) => {
  const [pin, setPin] = useState<boolean>(false)

  return (
    <Box style={{ position: "relative" }}>
      <Paper
        sx={[
          (theme) => ({
            width: pin ? width : widthFolded,
            minHeight: "calc(100vh - var(--mantine-header-height))",
            maxHeight: "calc(100vh - var(--mantine-header-height))",
            borderTopStyle: "none",
            borderBottomStyle: "none",
            borderLeftStyle: "none",
            borderRadius: 0,
            position: "fixed",
            top: "var(--mantine-header-height)",
            left: 0,
            overflow: "hidden",
            transition: "width 250ms",
            zIndex: 9999,
            "&:hover": {
              width: width,
            },
            "&::after": {
              content: "''",
              position: "absolute",
              top: 0,
              right: 0,
              width: pin ? 0 : theme.spacing.xs,
              height: "100%",

              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.colors.white,
            },
            "&:hover::after": {
              width: 0,
            },
          }),
          sx,
        ]}
        withBorder
      >
        <ScrollArea type="scroll" style={{ minWidth: width }}>
          <Stack
            spacing={0}
            //SCROLL AREA STYLES
            style={{
              minHeight: "calc(100vh - var(--mantine-header-height))",
              maxHeight: "calc(100vh - var(--mantine-header-height))",
            }}
          >
            {children}

            <ActionIcon
              style={{ position: "absolute", right: 8, top: 8, zIndex: 9999 }}
              radius="xl"
              onClick={() => {
                setPin((val) => {
                  onPin && onPin(!val)
                  return !val
                })
              }}
              onContextMenu={(e: SyntheticEvent) => {
                e.preventDefault()
                setIndependent && setIndependent(!independent)
              }}
              color={independent ? "blue" : undefined}
            >
              {pin ? <Pinned /> : <PinnedOff />}
            </ActionIcon>
          </Stack>
        </ScrollArea>
      </Paper>
    </Box>
  )
}

export default NavBar
