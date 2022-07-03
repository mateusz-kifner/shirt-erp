import { SpotlightProvider } from "@mantine/spotlight"
import type { SpotlightAction } from "@mantine/spotlight"
import { FC, ReactNode } from "react"
import { Bug, Search } from "tabler-icons-react"

const actions: SpotlightAction[] = [
  {
    title: "Home",
    description: "Get to home page",
    onTrigger: () => console.log("Home"),
    icon: <Bug size={18} />,
  },
  {
    title: "Dashboard",
    description: "Get full information about current system status",
    onTrigger: () => console.log("Dashboard"),
    icon: <Bug size={18} />,
  },
  {
    title: "Documentation",
    description: "Visit documentation to lean more about all features",
    onTrigger: () => console.log("Documentation"),
    icon: <Bug size={18} />,
  },
]

const Spotlight: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SpotlightProvider
      actions={actions}
      searchIcon={<Search size={18} />}
      searchPlaceholder="Szukaj..."
      shortcut="ctrl + s"
      nothingFoundMessage="Nic nie znaleziono..."
    >
      {children}
    </SpotlightProvider>
  )
}

export default Spotlight
