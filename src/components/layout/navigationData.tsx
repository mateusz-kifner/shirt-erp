import type { ComponentType } from "react";

import {
  BellIcon,
  CrownIcon,
  FileIcon,
  ListChecksIcon,
  LucideIcon,
  MailIcon,
  ShirtIcon,
  ShoppingCartIcon,
  UserIcon,
} from "lucide-react";

const navigationData: {
  label: string;
  Icon: LucideIcon;
  href: string;
  entryName: string;
  gradient?: { from: string; to: string; deg: number };
  SecondNavigation?: ComponentType;
  debug?: boolean;
}[] = [
  {
    label: "Zadania",
    Icon: ListChecksIcon,
    href: "/erp/task",
    entryName: "task",
    gradient: { from: "#099268", to: "#66A80F", deg: 105 },
  },
  {
    label: "Zamówienia",
    Icon: CrownIcon,
    href: "/erp/order",
    entryName: "order",
    gradient: { from: "#3B5BDB", to: "#0C8599", deg: 105 },
  },
  {
    label: "Produkty",
    Icon: ShirtIcon,
    href: "/erp/product",
    entryName: "product",
    gradient: { from: "#9C36B5", to: "#E03131", deg: 105 },
  },
  {
    label: "Klienci",
    Icon: UserIcon,
    href: "/erp/client",
    entryName: "client",
    gradient: { from: "#E8590C", to: "#F08C00", deg: 105 },
  },
  {
    label: "Wydatki",
    Icon: ShoppingCartIcon,
    href: "/erp/expense",
    entryName: "expense",
    gradient: { from: "#E03131", to: "#E8590C", deg: 105 },
  },
  {
    label: "Maile",
    Icon: MailIcon,
    href: "/erp/email-message",
    entryName: "email",
    gradient: { from: "#3B5BDB", to: "#099268", deg: 105 },
  },
  {
    label: "Logi",
    Icon: BellIcon,
    href: "/erp/log",
    entryName: "log",
    debug: true,
  },
  {
    label: "Zamówienia archiwalne",
    Icon: BellIcon,
    href: "/erp/order-archive",
    entryName: "orders-archive",
    debug: true,
  },
  {
    label: "Pracownicy",
    Icon: BellIcon,
    href: "/erp/user",
    entryName: "user",
    debug: true,
  },
  {
    label: "Pliki",
    Icon: FileIcon,
    href: "/erp/file",
    entryName: "upload/file",
    gradient: { from: "#2F9E44", to: "#66A80F", deg: 105 },
    debug: true,
  },
];

export default navigationData;
