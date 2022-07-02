import { DefaultMantineColor, MantineGradient } from "@mantine/core"
import { ComponentType, ReactNode } from "react"
import { Bell, Checklist, Crown, Mail, Shirt, User } from "./utils/TablerIcons"

const navigationData: {
  label: string
  Icon: ReactNode
  to: string
  entryName: string
  color?: DefaultMantineColor
  gradient?: MantineGradient
  SecondNavigation?: ComponentType<any>
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
    Icon: <Bell size={32} />,
    to: "/erp/expenses",
    entryName: "expenses",
  },
  {
    label: "Maile",
    Icon: <Mail size={32} />,
    to: "/erp/email-messages",
    entryName: "email",
  },
  {
    label: "Logi",
    Icon: <Bell size={32} />,
    to: "/erp/logs",
    entryName: "logs",
  },
  {
    label: "Zamówienia archiwalne",
    Icon: <Bell size={32} />,
    to: "/erp/orders-archive",
    entryName: "orders-archive",
  },
  {
    label: "Pracownicy",
    Icon: <Bell size={32} />,
    to: "/erp/users",
    entryName: "users",
  },
]

export default navigationData
