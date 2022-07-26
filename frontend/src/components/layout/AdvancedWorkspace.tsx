import { Tabs } from "@mantine/core"
import { Tab } from "@mantine/core/lib/Tabs/Tab/Tab"
import { Children, FC, ReactNode } from "react"
import { useSearchParams } from "react-router-dom"
import { Sun } from "tabler-icons-react"
import ResponsivePaper from "../ResponsivePaper"

interface AdvancedWorkspaceProps {
  children: ReactNode
}

const AdvancedWorkspace: FC<AdvancedWorkspaceProps> = (props) => {
  const { children } = props
  const [searchParams, setSearchParams] = useSearchParams()

  const display_windows = (
    searchParams.get("display_windows")?.split
      ? searchParams
          .get("display_windows")
          ?.split(",")
          .map((val) => parseInt(val))
      : []
  ) as number[]

  return (
    <div style={{ position: "relative" }}>
      {/* <div style={{ display: "flex" }}> */}
      <Tabs
        variant="outline"
        styles={(theme) => ({
          tabActive: {
            backgroundColor: `${theme.colors.dark[8]} !important`,
          },
          tabsList: {
            paddingLeft: 52,
          },
          root: {
            position: "absolute",
            top: -40,
            zIndex: 1001,
          },
        })}
      >
        <Tabs.List>
          {children &&
            Children.map(
              children,
              (child, index) =>
                display_windows.includes(index) && (
                  <Tabs.Tab value="Gallery" icon={<Sun size={14} />}>
                    <ResponsivePaper
                      m="sm"
                      style={{
                        flexGrow: 1,
                        flexBasis: 1,
                        // backgroundColor: "transparent",
                        borderStyle: "none",
                        display: "flex",
                      }}
                    >
                      {child}
                    </ResponsivePaper>
                  </Tabs.Tab>
                )
            )}
        </Tabs.List>
      </Tabs>
      {/* </div> */}
    </div>
  )
}

export default AdvancedWorkspace
