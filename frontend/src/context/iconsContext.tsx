import { createContext, useState, ReactNode, useContext } from "react"
import { ImageType } from "../types/ImageType"

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
