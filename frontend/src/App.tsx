import { FC, useEffect, useState } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import axios from "axios"
import { useRecoilState, useRecoilValue } from "recoil"

import { loginState } from "./atoms/loginState"
import PageLayout from "./components/PageLayout"

import ClientsPage from "./pages/clients/ClientsPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import ErrorPage from "./pages/ErrorPage"
import ExpensesPage from "./pages/expenses/ExpensesPage"
import FilesPage from "./pages/files/FilesPage"
import LoggerPage from "./pages/logger/LoggerPage"
import LoginPage from "./pages/LoginPage"
import OrdersPage from "./pages/orders/OrdersPage"
import ProductionPage from "./pages/production/ProductionPage"
import ProductsPage from "./pages/products/ProductsPage"
import SettingsPage from "./pages/settings/SettingsPage"
import TasksPage from "./pages/tasks/TasksPage"
import { useQuery } from "react-query"
import { Modal, Spin, Typography } from "antd"

const { Title } = Typography

const App: FC = () => {
  // const isAuthenticated = useRecoilValue(isAuthenticatedSelector)
  const [login, setLogin] = useRecoilState(loginState)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { data, refetch, isLoading, failureCount } = useQuery(
    ["ping"],
    async () => {
      const res = await axios.get("/")
      return res.data
    },
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
    <div className="App">
      {!data && (
        <Modal
          visible={true}
          onOk={() => {
            refetch()
          }}
          onCancel={() => {
            refetch()
          }}
          okText="Spróbuj ponownie"
          closable={false}
          cancelButtonProps={{ disabled: true, style: { display: "none" } }}
        >
          <Title level={3}>Nie można się połączyć z serverem!</Title>
          {console.log(data)}
          {failureCount > 0 && "Próba połączenia numer " + failureCount + " "}
          {isLoading && <Spin></Spin>}
        </Modal>
      )}
      {!isAuthenticated && <LoginPage />}
      <Router>
        <PageLayout>
          <Routes>
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
                {login.debug && (
                  <Route path="/logger" element={<LoggerPage />} />
                )}
                <Route path="*" element={<ErrorPage errorcode={404} />} />
              </>
            )}
          </Routes>
        </PageLayout>
      </Router>
    </div>
  )
}

export default App
