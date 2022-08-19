import axios from "axios"
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react"
import { UserType } from "../types/UserType"

interface LoginDataType {
  user: UserType
  jwt: string
}

interface AuthContextType {
  jwt: string
  user: UserType | null
  debug: boolean
  navigationCollapsed: boolean
  isAuthenticated: boolean
  isLoaded: boolean
  signIn: (loginData: LoginDataType) => void
  signOut: () => void
  toggleNavigationCollapsed: () => void
  setNavigationCollapsed: Dispatch<SetStateAction<boolean>>
  toggleDebug: () => void
  setWelcomeMessageHash: (hash: string) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [jwt, setJwt] = useState<string>("")
  const [user, setUser] = useState<UserType | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [debug, setDebug] = useState(false)
  const [navigationCollapsed, setNavigationCollapsed] = useState(false)

  const getLoginStateAsJson = () => {
    return JSON.stringify({ jwt, user, debug, navigationCollapsed })
  }

  useEffect(() => {
    const loginState = localStorage.getItem("loginState")
    if (loginState) {
      const loginStorage = JSON.parse(loginState)
      loginStorage?.jwt &&
        loginStorage.jwt?.length > 0 &&
        signIn({ user: loginStorage?.user, jwt: loginStorage.jwt })
      setDebug(debug)
      setNavigationCollapsed(navigationCollapsed)
    }
    setIsLoaded(true)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("loginState", getLoginStateAsJson())
    }
    // eslint-disable-next-line
  }, [isAuthenticated, debug, navigationCollapsed])

  const signIn = ({ user, jwt }: { user: UserType; jwt: string }) => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + jwt
    setJwt(jwt)
    setUser(user)
    setIsAuthenticated(true)
  }

  const signOut = () => {
    delete axios.defaults.headers.common["Authorization"]
    setJwt("")
    setUser(null)
    setIsAuthenticated(false)
  }

  const setWelcomeMessageHash = (hash: string) => {}

  return (
    <AuthContext.Provider
      value={{
        jwt,
        user,
        debug,
        navigationCollapsed,
        isAuthenticated,
        isLoaded,
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