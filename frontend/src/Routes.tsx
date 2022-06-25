import { Group } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { Routes as Switch, Route, Navigate, Outlet } from "react-router-dom"
import { loginState } from "./atoms/loginState"
import ClientsPage from "./pages/erp/clients/ClientsPage"
import DashboardPage from "./pages/erp/dashboard/DashboardPage"
import ErrorPage from "./pages/ErrorPage"
import FilesPage from "./pages/erp/files/FilesPage"
import LoggerPage from "./pages/erp/loggers/LoggerPage"
import LoginPage from "./pages/LoginPage"
import OrdersPage from "./pages/erp/orders/OrdersPage"
import OrdersArchivePage from "./pages/erp/orders-archive/OrdersArchivePage"
import SettingsPage from "./pages/erp/settings/SettingsPage"
import TasksPage from "./pages/erp/tasks/TasksPage"
import UsersPage from "./pages/erp/users/UsersPage"
import axios from "axios"
import { useRecoilState } from "recoil"
import { useNetwork } from "@mantine/hooks"
import ProceduresPage from "./pages/erp/production/ProceduresPage"
import WorkstationsPage from "./pages/erp/production/WorkstationsPage"
import EmailMessagesPage from "./pages/erp/email-messages/EmailMessagesPage"
import ProductEditable from "./pages/erp/products/ProductEditable"
import ProductsList from "./pages/erp/products/ProductsList"
import ResponsivePaper from "./components/ResponsivePaper"
import AdvancedWorkspace from "./components/AdvancedWorkspace"
import ExpensesList from "./pages/erp/expenses/ExpensesList"
import ExpenseEditable from "./pages/erp/expenses/ExpenseEditable"

const Routes: FC = () => {
  const [login, setLogin] = useRecoilState(loginState)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const networkStatus = useNetwork()

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
    if (login?.jwt !== undefined && login?.jwt.length > 0) {
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
        <Route path="/admin">
          <Route path="*" element={<EmptyPage />} />
          <Route path="" element={<EmptyPage />} />
        </Route>
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
            <Route
              path="/erp/products"
              element={
                <Group
                  sx={(theme) => ({
                    flexWrap: "nowrap",
                    alignItems: "flex-start",
                    padding: theme.spacing.xl,
                    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                      padding: 0,
                    },
                  })}
                >
                  <ResponsivePaper>
                    <ProductsList />
                  </ResponsivePaper>
                  <Outlet />
                </Group>
              }
            >
              <Route
                path=":id"
                element={
                  <ResponsivePaper style={{ flexGrow: 1 }}>
                    <ProductEditable />
                  </ResponsivePaper>
                }
              />
              {/* <Route path="" /> */}
            </Route>
            <Route path="/erp/clients">
              <Route path=":id" element={<ClientsPage />} />
              <Route path="" element={<ClientsPage />} />
            </Route>
            <Route path="/erp/procedures">
              <Route path=":id" element={<ProceduresPage />} />
              <Route path="" element={<ProceduresPage />} />
            </Route>
            <Route path="/erp/workstations">
              <Route path=":id" element={<WorkstationsPage />} />
              <Route path="" element={<WorkstationsPage />} />
            </Route>
            <Route
              path="/erp/expenses"
              element={
                <AdvancedWorkspace navigation={<ExpensesList />}>
                  <Outlet />
                </AdvancedWorkspace>
              }
            >
              <Route path=":id" element={<ExpenseEditable />} />
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
            <Route path="/erp/email-messages">
              <Route path=":id" element={<EmailMessagesPage />} />
              <Route path="" element={<EmailMessagesPage />} />
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

const EmptyPage: FC = () => {
  return null
}

export default Routes
