import { DefaultMantineColor, MantineGradient } from "@mantine/core"
import { ComponentType, ReactNode } from "react"
import {
  Checklist,
  Crown,
  Mail,
  Shirt,
  User,
  File,
  Bell,
  ShoppingCart,
} from "tabler-icons-react"

const navigationData: {
  label: string
  Icon: ReactNode
  to: string
  entryName: string
  color?: DefaultMantineColor
  gradient?: MantineGradient
  SecondNavigation?: ComponentType<any>
  debug?: boolean
}[] = [
  {
    label: "Zadania",
    Icon: <Checklist size={32} />,
    to: "/erp/tasks",
    entryName: "tasks",
    gradient: { from: "teal", to: "lime", deg: 105 },
  },
  {
    label: "Zamówienia",
    Icon: <Crown size={32} />,
    to: "/erp/orders",
    entryName: "orders",
    gradient: { from: "indigo", to: "cyan", deg: 105 },
  },
  {
    label: "Produkty",
    Icon: <Shirt size={32} />,
    to: "/erp/products",
    entryName: "products",
    gradient: { from: "grape", to: "red", deg: 105 },
  },
  {
    label: "Klienci",
    Icon: <User size={32} />,
    to: "/erp/clients",
    entryName: "clients",
    gradient: { from: "orange", to: "gold", deg: 105 },
  },
  {
    label: "Wydatki",
    Icon: <ShoppingCart size={32} />,
    to: "/erp/expenses",
    entryName: "expenses",
    gradient: { from: "red", to: "orange", deg: 105 },
  },
  {
    label: "Maile",
    Icon: <Mail size={32} />,
    to: "/erp/email-messages",
    entryName: "email",
    gradient: { from: "indigo", to: "teal", deg: 105 },
  },
  {
    label: "Logi",
    Icon: <Bell size={32} />,
    to: "/erp/logs",
    entryName: "logs",
    debug: true,
  },
  {
    label: "Zamówienia archiwalne",
    Icon: <Bell size={32} />,
    to: "/erp/order-archives",
    entryName: "orders-archive",
    debug: true,
  },
  {
    label: "Pracownicy",
    Icon: <Bell size={32} />,
    to: "/erp/users",
    entryName: "users",
    debug: true,
  },
  {
    label: "Pliki",
    Icon: <File size={32} />,
    to: "/erp/files",
    entryName: "upload/files",
    gradient: { from: "green", to: "lime", deg: 105 },
    debug: true,
  },
]

export default navigationData
