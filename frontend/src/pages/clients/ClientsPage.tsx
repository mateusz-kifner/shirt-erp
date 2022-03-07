import { FC, useRef, useState } from "react"
import SplitPane from "react-split-pane"

import ClientDetails from "./ClientDetails"
import ClientsList, { ClientsListHandle } from "./ClientsList"

import styles from "../../components/SplitPaneWithSnap.module.css"

export const client_template: any = {
  id: {
    label: "id",
    type: "id",
  },
  username: {
    label: "Nazwa użytkownika",
    type: "string",

    initialValue: "",
    required: true,
  },
  firstname: {
    label: "Imie",
    type: "string",

    initialValue: "",
  },
  lastname: {
    label: "Nazwisko",
    type: "string",

    initialValue: "",
  },
  notes: {
    label: "Notatki",
    type: "string",

    initialValue: "",
    multiline: true,
  },
  email: {
    label: "Email",
    type: "string",

    initialValue: "",
  },
  phoneNumber: {
    label: "Telefon",
    type: "string",

    initialValue: "",
  },
  // ordersNumber: {
  //   label: "Liczba zamówień",
  //   type: "number",

  //   initialValue: 0,
  //   disabled: true,
  // },
  companyName: {
    label: "Nazwa firmy",
    type: "string",

    initialValue: "",
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
  orders: {
    label: "Zamówienia",
    type: "orders",

    // initialValue: [],
  },

  orderArchives: {
    label: "Zamówienia archiwizowane",
    type: "orders",

    // initialValue: [],
  },
  secretNotes: {
    label: "Sekretne Notatki",
    type: "secretString",

    initialValue: "",
    multiline: true,
    hide: true,
  },
  createdAt: {
    label: "Utworzono",
    type: "datetime",
    disabled: true,
  },
  updatedAt: {
    label: "Edytowano",
    type: "datetime",
    disabled: true,
  },
}

const ClientsPage: FC = () => {
  const [clientId, setClientId] = useState<number | undefined>()
  const clientListRef = useRef<ClientsListHandle>(null)
  return (
    <SplitPane
      split="vertical"
      minSize={180}
      defaultSize={480}
      className={styles.splitpane}
    >
      <div className={styles.pre_pane}>
        <div className={styles.pane}>
          <ClientsList
            ref={clientListRef}
            onItemClickId={setClientId}
            template={client_template}
          />
        </div>
      </div>
      <div className={styles.pre_pane}>
        <div className={styles.pane}>
          <ClientDetails
            clientId={clientId}
            template={client_template}
            onUpdate={clientListRef.current?.refetch}
          />
        </div>
      </div>
    </SplitPane>
  )
}

export default ClientsPage
