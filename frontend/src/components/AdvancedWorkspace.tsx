import { Children, FC, ReactNode } from "react"
import { useSearchParams } from "react-router-dom"
import ResponsivePaper from "./ResponsivePaper"

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
    <div>
      {children &&
        Children.map(
          children,
          (child, index) =>
            display_windows.includes(index) && (
              <ResponsivePaper
                m="sm"
                style={{
                  flexGrow: 1,
                  flexBasis: 1,
                  backgroundColor: "transparent",
                  borderStyle: "none",
                }}
              >
                {child}
              </ResponsivePaper>
            )
        )}
    </div>
  )
}

export default AdvancedWorkspace
