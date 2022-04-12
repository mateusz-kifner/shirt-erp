import React from "react"
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
} from "react-router-dom"
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

const Routes = () => {
  const isAuthenticated = true
  const login = { debug: true }
  return (
    <>
      {!isAuthenticated && <LoginPage />}
      <Router>
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
      </Router>
    </>
  )
}

export default Routes
