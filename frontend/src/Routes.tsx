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
import OrdersList from "./pages/erp/orders/OrdersList"
import ClientsList from "./pages/erp/clients/ClientList"
import UsersList from "./pages/erp/users/UsersList"
import OrdersArchiveList from "./pages/erp/orders-archive/OrdersArchiveList"
import EmailMessagesList from "./pages/erp/email-messages/EmailMessagesList"
import TasksList from "./pages/erp/tasks/TasksList"

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
        {!isAuthenticated && (
          <Route path="*" element={<ErrorPage errorcode={403} />} />
        )}
        {isAuthenticated && (
          <>
            <Route path="/" element={<Navigate to="/erp/orders" replace />} />
            <Route path="dashboard">
              <Route path="" element={<DashboardPage />} />
            </Route>
            <Route
              path="tasks"
              element={
                <ResponsivePaper>
                  <TasksList />
                </ResponsivePaper>
              }
            >
              <Route path=":id" element={<TasksPage />} />
              <Route path="" element={<ErrorPage errorcode={404} />} />
            </Route>
            <Route
              path="orders"
              element={
                <ResponsivePaper>
                  <OrdersList />
                </ResponsivePaper>
              }
            >
              <Route path=":id" element={<OrdersPage />} />
              <Route path="" element={<ErrorPage errorcode={404} />} />
            </Route>
            <Route
              path="/erp/products"
              element={
                <ResponsivePaper>
                  <ProductsList />
                </ResponsivePaper>
              }
            >
              <Route path=":id" element={<ProductEditable />} />
              <Route path="" element={<ErrorPage errorcode={404} />} />
            </Route>
            <Route
              path="clients"
              element={
                <ResponsivePaper>
                  <ClientsList />
                </ResponsivePaper>
              }
            >
              <Route path=":id" element={<ClientsPage />} />
              <Route path="" element={<ErrorPage errorcode={404} />} />
            </Route>
            <Route path="procedures">
              <Route path=":id" element={<ProceduresPage />} />
              <Route path="" element={<ErrorPage errorcode={404} />} />
            </Route>
            <Route path="workstations">
              <Route path=":id" element={<WorkstationsPage />} />
              <Route path="" element={<ErrorPage errorcode={404} />} />
            </Route>
            <Route
              path="/erp/expenses"
              element={
                <ResponsivePaper>
                  <ExpensesList />
                </ResponsivePaper>
              }
            >
              <Route path=":id" element={<ExpenseEditable />} />
              <Route path="" element={<ErrorPage errorcode={404} />} />
            </Route>
            <Route path="/erp/files" element={<FilesPage />} />
            <Route path="settings">
              <Route path="" element={<SettingsPage />} />
            </Route>
            <Route
              path="users"
              element={
                <ResponsivePaper>
                  <UsersList />
                </ResponsivePaper>
              }
            >
              <Route path=":id" element={<UsersPage />} />
              <Route path="" element={<ErrorPage errorcode={404} />} />
            </Route>
            <Route
              path="orders-archive"
              element={
                <ResponsivePaper>
                  <OrdersArchiveList />
                </ResponsivePaper>
              }
            >
              <Route path=":id" element={<OrdersArchivePage />} />
              <Route path="" element={<ErrorPage errorcode={404} />} />
            </Route>
            <Route
              path="email-messages"
              element={
                <ResponsivePaper>
                  <EmailMessagesList />
                </ResponsivePaper>
              }
            >
              <Route path=":id" element={<EmailMessagesPage />} />
              <Route path="" element={<ErrorPage errorcode={404} />} />
            </Route>
            {login.debug && (
              <Route path="logs">
                <Route path=":id" element={<LoggerPage />} />
                <Route path="" element={<ErrorPage errorcode={404} />} />
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
