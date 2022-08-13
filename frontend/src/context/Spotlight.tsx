import { SpotlightProvider } from "@mantine/spotlight"
import type { SpotlightAction } from "@mantine/spotlight"
import { FC, ReactNode, useState } from "react"
import { Bug, Search } from "tabler-icons-react"
import axios from "axios"
import { useQuery } from "react-query"
import { useDebouncedValue } from "@mantine/hooks"
import { useRouter } from "next/router"
import { useAuthContext } from "./authContext"

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
  const { isAuthenticated } = useAuthContext()
  // const router = useRouter()
  const [query, setQuery] = useState<string>("")
  const [debounced] = useDebouncedValue(query, 500)
  const { data } = useQuery(
    ["search", debounced],
    () => fetchSearch(debounced),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: isAuthenticated,
    }
  )

  const actions: SpotlightAction[] = data?.orders
    ? data?.orders.map((val: any) => ({
        title: val.name,
        description: val.status + " , Data oddania: " + val.dateOfCompletion,
        onTrigger: () => {},
        // onTrigger: () => router.push("/erp/" + "orders" + "/" + val.id),
      }))
    : []

  return (
    <SpotlightProvider
      actions={actions}
      searchIcon={<Search size={18} />}
      searchPlaceholder="Szukaj..."
      shortcut="ctrl + s"
      nothingFoundMessage={
        query !== debounced ? "Szukam..." : "Nic nie znaleziono..."
      }
      onQueryChange={(query: string) => setQuery(query)}
    >
      {children}
    </SpotlightProvider>
  )
}

export default Spotlight
