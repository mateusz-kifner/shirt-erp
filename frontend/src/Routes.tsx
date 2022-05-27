import { DefaultMantineColor } from "@mantine/core"
import { FC, ReactElement, useEffect, useState } from "react"
import { useQuery } from "react-query"
import {
  // BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
} from "react-router-dom"
import { Bell, Checklist, Crown, Shirt, User } from "./utils/TablerIcons"
import { loginState } from "./atoms/loginState"
import ClientsPage from "./pages/erp/clients/ClientsPage"
import DashboardPage from "./pages/erp/dashboard/DashboardPage"
import ErrorPage from "./pages/ErrorPage"
import ExpensesPage from "./pages/erp/expenses/ExpensesPage"
import FilesPage from "./pages/erp/files/FilesPage"
import LoggerPage from "./pages/erp/logger/LoggerPage"
import LoginPage from "./pages/LoginPage"
import OrdersPage from "./pages/erp/orders/OrdersPage"
import OrdersArchivePage from "./pages/erp/orders_archive/OrdersArchivePage"
import ProductionPage from "./pages/erp/production/ProductionPage"
import ProductsPage from "./pages/erp/products/ProductsPage"
import SettingsPage from "./pages/erp/settings/SettingsPage"
import TasksPage from "./pages/erp/tasks/TasksPage"
import UsersPage from "./pages/erp/users/UsersPage"
import axios from "axios"
import { useRecoilState } from "recoil"
import { useNetwork } from "@mantine/hooks"

export const navigationData: {
  label: string
  icon: ReactElement<any, any>
  to: string
  color?: DefaultMantineColor
}[] = [
  { label: "Zadania", icon: <Checklist />, to: "/erp/tasks", color: "green" },
  { label: "Zamówienia", icon: <Crown />, to: "/erp/orders", color: "blue" },
  { label: "Produkty", icon: <Shirt />, to: "/erp/products", color: "orange" },
  { label: "Klienci", icon: <User />, to: "/erp/clients", color: "lime" },
  { label: "production", icon: <Bell />, to: "/erp/production" },
  { label: "expenses", icon: <Bell />, to: "/erp/expenses" },
  { label: "files", icon: <Bell />, to: "/erp/files" },
  { label: "logger", icon: <Bell />, to: "/erp/logs" },
  { label: "orders-archive", icon: <Bell />, to: "/erp/orders-archive" },
  { label: "users", icon: <Bell />, to: "/erp/users" },
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
            <Route path="/" element={<Navigate to="/erp/orders" replace />} />
            <Route path="/erp/dashboard">
              <Route path=":id" element={<DashboardPage />} />
              <Route path="" element={<DashboardPage />} />
            </Route>
            <Route path="/erp/tasks">
              <Route path=":id" element={<TasksPage />} />
              <Route path="" element={<TasksPage />} />
            </Route>
            <Route path="/erp/orders">
              <Route path=":id" element={<OrdersPage />} />
              <Route path="" element={<OrdersPage />} />
            </Route>
            <Route path="/erp/products">
              <Route path=":id" element={<ProductsPage />} />
              <Route path="" element={<ProductsPage />} />
            </Route>
            <Route path="/erp/clients">
              <Route path=":id" element={<ClientsPage />} />
              <Route path="" element={<ClientsPage />} />
            </Route>
            <Route path="/erp/production">
              <Route path=":id" element={<ProductionPage />} />
              <Route path="" element={<ProductionPage />} />
            </Route>
            <Route path="/erp/expenses">
              <Route path=":id" element={<ExpensesPage />} />
              <Route path="" element={<ExpensesPage />} />
            </Route>
            <Route path="/erp/files">
              <Route path=":id" element={<FilesPage />} />
              <Route path="" element={<FilesPage />} />
            </Route>
            <Route path="/erp/settings">
              <Route path=":id" element={<SettingsPage />} />
              <Route path="" element={<SettingsPage />} />
            </Route>
            <Route path="/erp/users">
              <Route path=":id" element={<UsersPage />} />
              <Route path="" element={<UsersPage />} />
            </Route>
            <Route path="/erp/orders-archive">
              <Route path=":id" element={<OrdersArchivePage />} />
              <Route path="" element={<OrdersArchivePage />} />
            </Route>
            {login.debug && (
              <Route path="/erp/logs">
                <Route path=":id" element={<LoggerPage />} />
                <Route path="" element={<LoggerPage />} />
              </Route>
            )}
            <Route path="*" element={<ErrorPage errorcode={404} />} />
          </>
        )}
      </Switch>
    </>
  )
}

export default Routes
