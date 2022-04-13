import { DefaultMantineColor } from "@mantine/core"
import { FC, ReactElement, useEffect, useState } from "react"
import { useQuery } from "react-query"
import {
  BrowserRouter as Router,
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

export const navigationData: {
  label: String
  icon: ReactElement<any, any>
  to: String
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
  const { data, refetch, isLoading, failureCount } = useQuery(
    ["ping"],
    async () => {
      const res = await axios.get("/ping")
      return res.data
    }
  )

  useEffect(() => {
    if (login.jwt !== undefined && login.jwt.length > 0 && isAuthenticated) {
      axios
        .get("/users/me")
        .then((res) => {})
        .catch(() => {
          setIsAuthenticated(false)
          setLogin((val) => ({ ...val, jwt: "", user: null, debug: false }))
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
      {/* <Router> */}
      <Switch>
        {!isAuthenticated && (
          <Route path="*" element={<ErrorPage errorcode={403} />} />
        )}
        {isAuthenticated && (
          <>
            <Route path="/" element={<Navigate to="/orders" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/production" element={<ProductionPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/orders-archive" element={<OrdersArchivePage />} />
            {login.debug && <Route path="/logger" element={<LoggerPage />} />}
            <Route path="*" element={<ErrorPage errorcode={404} />} />
          </>
        )}
      </Switch>
      {/* </Router> */}
    </>
  )
}

export default Routes
