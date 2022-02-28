import { FC, useRef, useState } from "react";
import SplitPane from "react-split-pane";

import OrderDetails from "./OrderDetails";
import OrdersList, { OrdersListHandle } from "./OrdersList";

import styles from "../../components/SplitPaneWithSnap.module.css";

export const order_template: any = {
  id: {
    label: "id",
    type: "id",
  },
  name: {
    label: "Nazwa",
    type: "string",
    initialValue: "",
    required: true,
  },
  status: {
    label: "Status",
    type: "enum",
    initialValue: "planowane",
    enum_data: [
      "planowane",
      "zaakceptowane",
      "w produkcji",
      "zapakowane",
      "wysłane",
      "odrzucone",
      "archiwizowane",
    ],
  },
  notes: {
    label: "Notatki",
    type: "string",
    initialValue: "",
    multiline: true,
  },
  price: {
    label: "Cena",
    type: "money",

    initialValue: 0,
  },
  isPricePaid: {
    label: "Cena zapłacona",
    type: "boolean",
    initialValue: false,
    children: { checked: "Tak", unchecked: "Nie" },
  },
  advance: {
    label: "Zaliczka",
    type: "money",

    initialValue: 0,
  },
  isAdvancePaid: {
    label: "Zaliczka zapłacona",
    type: "boolean",
    initialValue: false,
    children: { checked: "Tak", unchecked: "Nie" },
  },
  dateOfCompletion: {
    label: "Data ukończenia",
    type: "date",
  },
  secretNotes: {
    label: "Sekretne notatki",
    type: "string",
    initialValue: "",
    hide: true,
  },
  files: {
    label: "Pliki",
    type: "files",
    initialValue: [],
  },
  address: {
    label: {
      streetName: "Ulica",
      streetNumber: "Nr. bloku",
      apartmentNumber: "Nr. mieszkania",
      city: "Miasto",
      province: "Województwo",
      postCode: "Kod pocztowy",
      name: "Address",
    },
    type: "address",
    initialValue: {
      streetName: "",
      streetNumber: "",
      apartmentNumber: "",
      city: "",
      province: "pomorskie",
      postCode: "",
    },
  },
  products: {
    label: "Produkty",
    type: "productcomponents",
    // disabled: true,
  },
  client: {
    label: "Klient",
    type: "client",
    // disabled: true
    initialValue: undefined,
  },
  employees: {
    label: "Pracownicy",
    type: "users",
    // disabled: true
    initialValue: undefined,
  },
  created_at: {
    label: "Utworzono",
    type: "datetime",
    disabled: true,
  },
  updated_at: {
    label: "Edytowano",
    type: "datetime",
    disabled: true,
  },
};

const OrdersPage: FC = () => {
  const [orderId, setOrderId] = useState<number | undefined>();
  const orderListRef = useRef<OrdersListHandle>(null);
  return (
    <SplitPane
      split="vertical"
      minSize={180}
      defaultSize={480}
      className={styles.splitpane}
    >
      <div className={styles.pre_pane}>
        <div className={styles.pane}>
          <OrdersList
            ref={orderListRef}
            onItemClickId={setOrderId}
            template={order_template}
          />
        </div>
      </div>
      <div className={styles.pre_pane}>
        <div className={styles.pane}>
          <OrderDetails
            orderId={orderId}
            template={order_template}
            onUpdate={orderListRef.current?.refetch}
          />
        </div>
      </div>
    </SplitPane>
  );
};

export default OrdersPage;
