import type { ComponentType } from "react";

import {
  IconBell,
  IconChecklist,
  IconCrown,
  IconFile,
  IconMail,
  IconShirt,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";

import type TablerIconType from "./types/TablerIconType";

const navigationData: {
  label: string;
  Icon: TablerIconType;
  href: string;
  entryName: string;
  gradient?: { from: string; to: string; deg: number };
  SecondNavigation?: ComponentType;
  debug?: boolean;
}[] = [
  {
    label: "Zadania",
    Icon: IconChecklist,
    href: "/erp/task",
    entryName: "task",
    gradient: { from: "#099268", to: "#66A80F", deg: 105 },
  },
  {
    label: "Zamówienia",
    Icon: IconCrown,
    href: "/erp/order",
    entryName: "order",
    gradient: { from: "#3B5BDB", to: "#0C8599", deg: 105 },
  },
  {
    label: "Produkty",
    Icon: IconShirt,
    href: "/erp/product",
    entryName: "product",
    gradient: { from: "#9C36B5", to: "#E03131", deg: 105 },
  },
  {
    label: "Klienci",
    Icon: IconUser,
    href: "/erp/client",
    entryName: "client",
    gradient: { from: "#E8590C", to: "#F08C00", deg: 105 },
  },
  {
    label: "Wydatki",
    Icon: IconShoppingCart,
    href: "/erp/expense",
    entryName: "expense",
    gradient: { from: "#E03131", to: "#E8590C", deg: 105 },
  },
  {
    label: "Maile",
    Icon: IconMail,
    href: "/erp/email-message",
    entryName: "email",
    gradient: { from: "#3B5BDB", to: "#099268", deg: 105 },
  },
  {
    label: "Logi",
    Icon: IconBell,
    href: "/erp/log",
    entryName: "log",
    debug: true,
  },
  {
    label: "Zamówienia archiwalne",
    Icon: IconBell,
    href: "/erp/order-archive",
    entryName: "orders-archive",
    debug: true,
  },
  {
    label: "Pracownicy",
    Icon: IconBell,
    href: "/erp/user",
    entryName: "user",
    debug: true,
  },
  {
    label: "Pliki",
    Icon: IconFile,
    href: "/erp/file",
    entryName: "upload/file",
    gradient: { from: "#2F9E44", to: "#66A80F", deg: 105 },
    debug: true,
  },
];

export default navigationData;
