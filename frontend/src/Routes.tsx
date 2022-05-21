import { DefaultMantineColor } from "@mantine/core"
import { FC, ReactElement, useEffect, useState } from "react"
import { useQuery } from "react-query"
import {
  // BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
} from "react-router-dom"
import { Bell, Checklist, Crown, Shirt, User } from "tabler-icons-react"
import { loginState } from "./atoms/loginState"
import ClientsPage from "./pages/clients/ClientsPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import ErrorPage from "./pages/ErrorPage"
import ExpensesPage from "./pages/expenses/ExpensesPage"
import FilesPage from "./pages/files/FilesPage"
import LoggerPage from "./pages/logger/LoggerPage"
import LoginPage from "./pages/LoginPage"
import OrdersPage from "./pages/orders/OrdersPage"
import OrdersArchivePage from "./pages/orders_archive/OrdersArchivePage"
import ProductionPage from "./pages/production/ProductionPage"
import ProductsPage from "./pages/products/ProductsPage"
import SettingsPage from "./pages/settings/SettingsPage"
import TasksPage from "./pages/tasks/TasksPage"
import UsersPage from "./pages/users/UsersPage"
import axios from "axios"
import { useRecoilState } from "recoil"
import { useNetwork } from "@mantine/hooks"

export const navigationData: {
  label: string
  icon: ReactElement<any, any>
  to: string
  color?: DefaultMantineColor
}[] = [
  { label: "Zadania", icon: <Checklist />, to: "tasks", color: "green" },
  { label: "Zamówienia", icon: <Crown />, to: "orders", color: "blue" },
  { label: "Produkty", icon: <Shirt />, to: "products", color: "orange" },
  { label: "Klienci", icon: <User />, to: "clients", color: "lime" },
  { label: "production", icon: <Bell />, to: "production" },
  { label: "expenses", icon: <Bell />, to: "expenses" },
  { label: "files", icon: <Bell />, to: "files" },
  { label: "logger", icon: <Bell />, to: "logger" },
  { label: "orders-archive", icon: <Bell />, to: "orders-archive" },
  { label: "users", icon: <Bell />, to: "users" },
]

const Routes: FC = () => {
  const [login, setLogin] = useRecoilState(loginState)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const networkStatus = useNetwork()

  // const { data, refetch, isLoading, failureCount } = useQuery(
  //   ["ping"],
  //   async () => {
  //     const res = await axios.get("/ping")
  //     return res.data
  //   }
  // )

  useEffect(() => {
    if (login.jwt !== undefined && login.jwt.length > 0 && isAuthenticated) {
      axios
        .get("/users/me")
        .then((res) => {})
        .catch(() => {
          if (networkStatus.online) {
            setIsAuthenticated(false)
            setLogin((val) => ({ ...val, jwt: "", user: null, debug: false }))
          }
        })
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (login.jwt !== undefined && login.jwt.length > 0) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + login.jwt
      setIsAuthenticated(true)
    } else {
      delete axios.defaults.headers.common["Authorization"]
      setIsAuthenticated(false)
    }
  }, [login])
  return (
    <>
      {!isAuthenticated && <LoginPage />}
      <Switch>
        {!isAuthenticated && (
          <Route path="*" element={<ErrorPage errorcode={403} />} />
        )}
        {isAuthenticated && (
          <>
            <Route path="/" element={<Navigate to="/orders" replace />} />
            <Route path="/dashboard">
              <Route path=":id" element={<DashboardPage />} />
              <Route path="" element={<DashboardPage />} />
            </Route>
            <Route path="/tasks">
              <Route path=":id" element={<TasksPage />} />
              <Route path="" element={<TasksPage />} />
            </Route>
            <Route path="/orders">
              <Route path=":id" element={<OrdersPage />} />
              <Route path="" element={<OrdersPage />} />
            </Route>
            <Route path="/products">
              <Route path=":id" element={<ProductsPage />} />
              <Route path="" element={<ProductsPage />} />
            </Route>
            <Route path="/clients">
              <Route path=":id" element={<ClientsPage />} />
              <Route path="" element={<ClientsPage />} />
            </Route>
            <Route path="/production">
              <Route path=":id" element={<ProductionPage />} />
              <Route path="" element={<ProductionPage />} />
            </Route>
            <Route path="/expenses">
              <Route path=":id" element={<ExpensesPage />} />
              <Route path="" element={<ExpensesPage />} />
            </Route>
            <Route path="/files">
              <Route path=":id" element={<FilesPage />} />
              <Route path="" element={<FilesPage />} />
            </Route>
            <Route path="/settings">
              <Route path=":id" element={<SettingsPage />} />
              <Route path="" element={<SettingsPage />} />
            </Route>
            <Route path="/users">
              <Route path=":id" element={<UsersPage />} />
              <Route path="" element={<UsersPage />} />
            </Route>
            <Route path="/orders-archive">
              <Route path=":id" element={<OrdersArchivePage />} />
              <Route path="" element={<OrdersArchivePage />} />
            </Route>
            {login.debug && <Route path="/logger" element={<LoggerPage />} />}
            <Route path="*" element={<ErrorPage errorcode={404} />} />
          </>
        )}
      </Switch>
    </>
  )
}

export default Routes
