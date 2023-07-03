import { useLocalStorage } from "@mantine/hooks"
import { createContext, useState, ReactNode, useContext } from "react"

interface ExperimentalFuturesType {
  search: boolean
  toggleSearch: () => void
  advancedNavigation: boolean
  toggleAdvancedNavigation: () => void
}

export const ExperimentalFuturesContext =
  createContext<ExperimentalFuturesType | null>(null)

export const ExperimentalFuturesProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [search, setSearch] = useLocalStorage<boolean>({
    key: "flag-search",
    defaultValue: true,
  })
  const [advancedNavigation, setAdvancedNavigation] = useLocalStorage<boolean>({
    key: "flag-advanced-navigation",
    defaultValue: false,
  })

  return (
    <ExperimentalFuturesContext.Provider
      value={{
        search,
        toggleSearch() {
          setSearch((val) => !val)
        },
        advancedNavigation,
        toggleAdvancedNavigation() {
          setAdvancedNavigation((val) => !val)
        },
      }}
    >
      {children}
    </ExperimentalFuturesContext.Provider>
  )
}

export function useExperimentalFuturesContext(): ExperimentalFuturesType {
  const state = useContext(ExperimentalFuturesContext)
  if (!state) {
    throw new Error(
      `ERROR: ExperimentalFutures reached logged-in-only component with null state`
    )
  }
  return state as ExperimentalFuturesType
}
