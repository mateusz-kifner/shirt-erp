import { Box, Group, Paper, UnstyledButton } from "@mantine/core"
import { Children, FC, ReactNode, useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "tabler-icons-react"
import { TransitionNoUnmount } from "../../mantine/TransitionNoUnmount"
import { SxBackground } from "../../styles/basic"
import ResponsivePaper from "../ResponsivePaper"

interface AdvancedWorkspaceProps {
  children: ReactNode
  navigation: ReactNode
}

const slide_right = {
  in: { transform: "translateX(0)" },
  out: { transform: "translateX(-100%)" },
  common: { transformOrigin: "right" },
  transitionProperty: "transform",
}

const slide_right_margin = {
  in: { width: 363 + 18 },
  out: { width: 18 },
  common: {},
  transitionProperty: "width",
}

const AdvancedWorkspace: FC<AdvancedWorkspaceProps> = (props) => {
  const { children, navigation } = props
  const params = useParams()
  const [navigationOpen, setNavigationOpen] = useState<boolean>(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [allowAnimation, setAllowAnimation] = useState<boolean>(false)
  const display_windows = (
    searchParams.get("display_windows")?.split
      ? searchParams
          .get("display_windows")
          ?.split(",")
          .map((val) => parseInt(val))
      : []
  ) as number[]

  useEffect(() => {
    if (!searchParams.get("display_windows")) {
      setSearchParams({ display_windows: "0" }, { replace: true })
    }
  })

  useEffect(() => {
    setTimeout(() => setAllowAnimation(true))
  })

  return (
    <div style={{ display: "flex" }}>
      {/* <TransitionNoUnmount
        mounted={navigationOpen}
        transition={slide_right_margin}
        duration={allowAnimation ? 200 : 1}
        timingFunction="ease-in-out"
      >
        {(stylesouter) => (
          <>
            <TransitionNoUnmount
              mounted={navigationOpen}
              transition={slide_right}
              duration={allowAnimation ? 200 : 1}
              timingFunction="ease-in-out"
            >
              {(stylesinner) => (
                <Paper
                  radius={1}
                  sx={(theme) => ({
                    minHeight:
                      "calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))",
                    position: "fixed",
                    // overflow: "hidden",
                    opacity: 1,
                    // width: navigationOpen ? undefined : 0,
                    // padding: navigationOpen ? theme.spacing.xl : 0,
                    // paddingRight: theme.spacing.xl + 18,
                  })}
                  p="xl"
                  style={
                    stylesinner ? stylesinner : { transform: "translate(0)" }
                  }
                >
                  <Box> {navigation}</Box>
                  <UnstyledButton
                    sx={(theme) => ({
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      right: -18,
                      width: 18,
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[6]
                          : theme.colors.gray[2],
                      // height: "100%",
                      // alignSelf: "stretch",
                      // justifySelf: "stretch",
                      flexBasis: 1,
                      zIndex: 99999,
                      overflow: "hidden",
                      "&:hover": {
                        backgroundColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.white,
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[6]
                            : theme.colors.gray[2],
                      },
                    })}
                    onClick={() => setNavigationOpen((val) => !val)}
                  >
                    {navigationOpen ? (
                      <ChevronLeft size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </UnstyledButton>
                </Paper>
              )}
            </TransitionNoUnmount> */}

      <Group p="md" style={{ minWidth: "100%" }}>
        <div style={{}}></div>
        {children &&
          Children.map(
            children,
            (child, index) =>
              display_windows.includes(index) && (
                <ResponsivePaper style={{ flexGrow: 1, flexBasis: 1 }}>
                  {child}
                </ResponsivePaper>
              )
          )}
      </Group>
      {/* </>
        )}
      </TransitionNoUnmount> */}
    </div>
  )
}

export default AdvancedWorkspace
