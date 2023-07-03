import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react"
import useStrapiList from "../hooks/useStrapiList"

export interface IconType {
  id: number
  name: string
  url: string
}

export interface IconsDataType {
  productCategories: IconType[]
  workstations: IconType[]
}

interface IconsContextType {
  iconsData: IconsDataType
  saveIcons: (data: any) => void
}

export const IconsContext = createContext<IconsContextType | null>(null)

export const IconsProvider = ({ children }: { children: ReactNode }) => {
  const [iconsData, setIconsData] = useState<IconsDataType>({
    productCategories: [],
    workstations: [],
  })

  const { data, refetch } = useStrapiList<any>(
    "icon",
    1,
    undefined,
    undefined,
    "asc",
    {
      pageSize: 100000,
      queryOptions: { enabled: false },
    }
  )

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (data !== undefined) {
      setIconsData(data)
    }
  }, [data])

  return (
    <IconsContext.Provider
      value={{
        iconsData,
        saveIcons: setIconsData,
      }}
    >
      {children}
    </IconsContext.Provider>
  )
}

export function useIconsContext(): IconsContextType {
  const state = useContext(IconsContext)
  if (!state) {
    throw new Error(`ERROR: Icons are not initialized `)
  }
  return state as IconsContextType
}
