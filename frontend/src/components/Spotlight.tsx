import { SpotlightProvider } from "@mantine/spotlight"
import type { SpotlightAction } from "@mantine/spotlight"
import { FC, ReactNode, useState } from "react"
import { Bug, Search } from "tabler-icons-react"
import axios from "axios"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

// const actions: SpotlightAction[] = [
//   {
//     title: "Home",
//     description: "Get to home page",
//     onTrigger: () => console.log("Home"),
//     icon: <Bug size={18} />,
//   },
//   {
//     title: "Dashboard",
//     description: "Get full information about current system status",
//     onTrigger: () => console.log("Dashboard"),
//     icon: <Bug size={18} />,
//   },
//   {
//     title: "Documentation",
//     description: "Visit documentation to lean more about all features",
//     onTrigger: () => console.log("Documentation"),
//     icon: <Bug size={18} />,
//   },
// ]

const fetchSearch = async (query: string) => {
  const res = await axios.get("fuzzy-search/search?query=" + encodeURI(query))
  console.log(res.data)
  return res.data
}

const Spotlight: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const [query, setQuery] = useState<string>("")
  const { data } = useQuery(["search", query], () => fetchSearch(query))

  const actions: SpotlightAction[] = data.orders.map((val: any) => ({
    title: val.name,
    description: val.status + " , Data oddania: " + val.dateOfCompletion,
    onTrigger: () => navigate("/erp/" + "orders" + "/" + val.id),
  }))

  return (
    <SpotlightProvider
      actions={actions}
      searchIcon={<Search size={18} />}
      searchPlaceholder="Szukaj..."
      shortcut="ctrl + s"
      nothingFoundMessage="Nic nie znaleziono..."
      onQueryChange={(query: string) => setQuery(query)}
    >
      {children}
    </SpotlightProvider>
  )
}

export default Spotlight
