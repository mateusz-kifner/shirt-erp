import { FC, useEffect, useState } from "react"
import { Routes as Switch, Route, Navigate, Outlet } from "react-router-dom"
import { loginState } from "./atoms/loginState"
import axios from "axios"
import { useRecoilState } from "recoil"
import { useNetwork } from "@mantine/hooks"
import ResponsivePaper from "./components/ResponsivePaper"
// Lists imports
import ProductsList from "./pages/erp/products/ProductsList"
import ExpensesList from "./pages/erp/expenses/ExpensesList"
import OrdersList from "./pages/erp/orders/OrdersList"
import ClientsList from "./pages/erp/clients/ClientList"
import UsersList from "./pages/erp/users/UsersList"
import OrdersArchiveList from "./pages/erp/orders-archive/OrdersArchiveList"
import EmailMessagesList from "./pages/erp/email-messages/EmailMessagesList"
import TasksList from "./pages/erp/tasks/TasksList"
import ProceduresList from "./pages/erp/production/ProceduresList"
import WorkstationsList from "./pages/erp/production/WorkstationsList"
// Pages imports
import ProductsPage from "./pages/erp/products/ProductsPage"
import ProceduresPage from "./pages/erp/production/ProceduresPage"
import WorkstationsPage from "./pages/erp/production/WorkstationsPage"
import EmailMessagesPage from "./pages/erp/email-messages/EmailMessagesPage"
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
import ExpensesPage from "./pages/erp/expenses/ExpensesPage"

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
            <Route path="/erp/tasks">
              <Route path=":id" element={<TasksPage />} />
              <Route
                path=""
                element={
                  <ResponsivePaper m="md" radius={4}>
                    <TasksList />
                  </ResponsivePaper>
                }
              />
            </Route>
            <Route path="/erp/orders">
              <Route path=":id" element={<OrdersPage />} />
              <Route
                path=""
                element={
                  <ResponsivePaper m="md" radius={4}>
                    <OrdersList />
                  </ResponsivePaper>
                }
              />
            </Route>
            <Route path="/erp/products">
              <Route path=":id" element={<ProductsPage />} />
              <Route
                path=""
                element={
                  <ResponsivePaper m="md" radius={4}>
                    <ProductsList />
                  </ResponsivePaper>
                }
              />
            </Route>
            <Route path="/erp/clients">
              <Route path=":id" element={<ClientsPage />} />
              <Route
                path=""
                element={
                  <ResponsivePaper m="md" radius={4}>
                    <ClientsList />
                  </ResponsivePaper>
                }
              />
            </Route>
            <Route path="/erp/procedures">
              <Route path=":id" element={<ProceduresPage />} />
              <Route path="" element={<ProceduresPage />} />
            </Route>
            <Route path="/erp/workstations">
              <Route path=":id" element={<WorkstationsPage />} />
              <Route path="" element={<WorkstationsPage />} />
            </Route>
            <Route path="/erp/expenses">
              <Route path=":id" element={<ExpensesPage />} />
              <Route
                path=""
                element={
                  <ResponsivePaper m="md" radius={4}>
                    <ExpensesList />
                  </ResponsivePaper>
                }
              />
            </Route>
            <Route path="/erp/files" element={<FilesPage />} />
            <Route path="/erp/settings">
              <Route path="" element={<SettingsPage />} />
            </Route>
            <Route path="/erp/users">
              <Route path=":id" element={<UsersPage />} />
              <Route
                path=""
                element={
                  <ResponsivePaper m="md" radius={4}>
                    <UsersList />
                  </ResponsivePaper>
                }
              />
            </Route>
            <Route path="/erp/orders-archive">
              <Route path=":id" element={<OrdersArchivePage />} />
              <Route
                path=""
                element={
                  <ResponsivePaper m="md" radius={4}>
                    <OrdersArchiveList />
                  </ResponsivePaper>
                }
              />
            </Route>
            <Route path="/erp/email-messages">
              <Route path=":id" element={<EmailMessagesPage />} />
              <Route
                path=""
                element={
                  <ResponsivePaper m="md" radius={4}>
                    <EmailMessagesList />
                  </ResponsivePaper>
                }
              />
            </Route>
            {login.debug && (
              <Route path="/erp/logs" element={<LoggerPage />}>
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

export default Routes
