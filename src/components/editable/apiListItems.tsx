import { type ComponentType } from "react";

// List items imports
import ClientListItem from "@/page-components/erp/client/ClientListItem";
// import EmailMessageListItem from "@/page-components/erp/email-messages/EmailMessageListItem"
// import ProductListItem from "@/page-components/erp/products/ProductListItem"
// import UserListItem from "@/page-components/erp/users/UserListItem"
// import WorkstationListItem from "@/page-components/erp/workstations/WorkstationListItem"
import OrderListItem from "@/page-components/erp/order/OrderListItem";

import { truncString } from "@/utils/truncString";

import ProductListItem from "@/page-components/erp/product/ProductListItem";
import UserListItem from "@/page-components/erp/user/UserListItem";
import { type ClientType } from "@/schema/clientSchema";
import { type OrderType } from "@/schema/orderSchema";
import { type ProductType } from "@/schema/productSchema";

type ItemTypes = ClientType | OrderType | ProductType;

export type apiListItems = {
  [key: string]: {
    ListItem: ComponentType<ItemTypes>;
    copyProvider: (val: ItemTypes) => string | undefined;
  };
};

const apiListItems = {
  client: {
    ListItem: ClientListItem,
    copyProvider: (value: ClientType) =>
      (value?.firstname && value.firstname?.length > 0) ||
      (value?.lastname && value.lastname?.length > 0)
        ? truncString(`${value.firstname ?? ""} ${value.lastname ?? ""}`, 40)
        : truncString(value?.username ? value.username : "", 40),
  },
  product: {
    ListItem: ProductListItem,
    copyProvider: (value: ProductType) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
  user: {
    ListItem: UserListItem,
    copyProvider: (value: any) =>
      value?.username ? truncString(value.username, 40) : undefined,
  },
  order: {
    ListItem: OrderListItem,
    copyProvider: (value: OrderType) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
  "order-archive": {
    ListItem: OrderListItem,
    copyProvider: (value: OrderType) =>
      value?.name ? truncString(value.name, 40) : undefined,
  },
  // workstations: {
  //   ListItem: WorkstationListItem,
  //   copyProvider: (value: any) =>
  //     value?.name ? truncString(value.name, 40) : undefined,
  // },
  // "email-messages": {
  //   ListItem: EmailMessageListItem,
  //   copyProvider: (value: any) =>
  //     value?.subject ? truncString(value.subject, 40) : undefined,
  // },
};

export default apiListItems;
