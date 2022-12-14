import { useMantineTheme } from "@mantine/core"
import { useLocalStorage, useMediaQuery } from "@mantine/hooks"
import axios from "axios"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
  useState,
} from "react"
import { UserType } from "../types/UserType"

interface LoginDataType {
  user: UserType | null
  jwt: string
}

interface AuthContextType {
  jwt: string
  user: UserType | null
  debug: boolean
  navigationCollapsed: boolean
  isAuthenticated: boolean
  hasTouch: boolean
  isSmall: boolean
  signIn: (loginData: LoginDataType) => void
  signOut: () => void
  toggleNavigationCollapsed: () => void
  setNavigationCollapsed: Dispatch<SetStateAction<boolean>>
  toggleDebug: () => void
  setWelcomeMessageHash: (hash: string) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [jwt, setJwt] = useLocalStorage<string>({
    key: "user-jwt",
    defaultValue: "",
  })
  const [user, setUser] = useLocalStorage<UserType | null>({
    key: "user-data",
    defaultValue: null,
  })
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [navigationCollapsed, setNavigationCollapsed] =
    useLocalStorage<boolean>({
      key: "user-navigation-collapsed",
      defaultValue: false,
    })
  const [secondNavigation, setSecondNavigation] = useLocalStorage<boolean>({
    key: "user-navigation-second",
    defaultValue: false,
  })
  const [debug, setDebug] = useLocalStorage<boolean>({
    key: "user-debug",
    defaultValue: false,
  })
  const theme = useMantineTheme()
  const smallerThanSM = useMediaQuery(
    `(max-width: ${theme.breakpoints.md}px)`,
    true
  )
  const hasTouch = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)"
  )

  useEffect(() => {
    if (jwt.length > 0) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + jwt
      setIsAuthenticated(true)
    } else {
      delete axios.defaults.headers.common["Authorization"]
      setIsAuthenticated(false)
    }
  }, [jwt])

  const signIn = ({ user, jwt }: LoginDataType) => {
    setJwt(jwt)
    setUser(user)
  }

  const signOut = () => {
    setJwt("")
    setUser(null)
  }

  const setWelcomeMessageHash = (hash: string) => {
    setUser((user_data) => {
      if (user_data !== null) {
        let new_user_data = { ...user_data }
        new_user_data.welcomeMessageHash = hash
        return new_user_data
      }
      return user_data
    })
  }

  return (
    <AuthContext.Provider
      value={{
        jwt,
        user,
        debug,
        navigationCollapsed,
        isAuthenticated,
        hasTouch,
        isSmall: smallerThanSM,
        signIn,
        signOut,
        toggleNavigationCollapsed: () => setNavigationCollapsed((val) => !val),
        setNavigationCollapsed,
        toggleDebug: () => setDebug((val) => !val),
        setWelcomeMessageHash,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextType {
  const state = useContext(AuthContext)
  if (!state) {
    throw new Error(
      `ERROR: Auth reached logged-in-only component with null 'user' in context`
    )
  }
  return state as AuthContextType
}
