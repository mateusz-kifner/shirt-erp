import { SpotlightProvider } from "@mantine/spotlight"
import type { SpotlightAction } from "@mantine/spotlight"
import { Home, Dashboard, FileText, Search } from "tabler-icons-react"
import { FC, ReactNode } from "react"

const actions: SpotlightAction[] = [
  {
    title: "Home",
    description: "Get to home page",
    onTrigger: () => console.log("Home"),
    icon: <Home size={18} />,
  },
  {
    title: "Dashboard",
    description: "Get full information about current system status",
    onTrigger: () => console.log("Dashboard"),
    icon: <Dashboard size={18} />,
  },
  {
    title: "Documentation",
    description: "Visit documentation to lean more about all features",
    onTrigger: () => console.log("Documentation"),
    icon: <FileText size={18} />,
  },
]

const Spotlight: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SpotlightProvider
      actions={actions}
      searchIcon={<Search size={18} />}
      searchPlaceholder="Search..."
      shortcut="ctrl + s"
      nothingFoundMessage="Nothing found..."
    >
      {children}
    </SpotlightProvider>
  )
}

export default Spotlight
