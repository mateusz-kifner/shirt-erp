import { ComponentType } from "react"

// List items imports
import ClientListItem from "../../page-components/erp/clients/ClientListItem"
import OrderListItem from "../../page-components/erp/orders/OrderListItem"
import ProductListItem from "../../page-components/erp/products/ProductListItem"
import UserListItem from "../../page-components/erp/users/UserListItem"
import WorkstationListItem from "../../page-components/erp/workstations/WorkstationListItem"

import { truncString } from "../../utils/truncString"

export type apiListItems = {
  [key: string]: {
    ListItem: ComponentType<any>
    copyProvider: (val: any) => string | undefined
  }
}

const apiListItems: apiListItems = {
  clients: {
    ListItem: ClientListItem,
    copyProvider: (value: any) =>
      (value?.firstname && value.firstname?.length > 0) ||
      (value?.lastname && value.lastname?.length > 0)
        ? truncString(value.firstname + " " + value.lastname, 40)
        : truncString(value?.username ? value.username : "", 40),
  },
  products: {
    ListItem: ProductListItem,
    copyProvider: (value: any) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
  users: {
    ListItem: UserListItem,
    copyProvider: (value: any) =>
      value?.username ? truncString(value.username, 40) : undefined,
  },
  orders: {
    ListItem: OrderListItem,
    copyProvider: (value: any) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
  "orders-archive": {
    ListItem: OrderListItem,
    copyProvider: (value: any) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
  workstations: {
    ListItem: WorkstationListItem,
    copyProvider: (value: any) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
}

export default apiListItems
