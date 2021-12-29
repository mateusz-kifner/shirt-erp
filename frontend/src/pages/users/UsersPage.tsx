import { FC, useRef, useState } from "react"
import SplitPane from "react-split-pane"

import UserDetails from "./UserDetails"
import UsersList, { UsersListHandle } from "./UsersList"

import styles from "../../components/SplitPaneWithSnap.module.css"

export const user_template: any = {
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
  secretNotes: {
    label: "Sekretne Notatki",
    type: "secretString",

    initialValue: "",
    multiline: true,
    hide: true,
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
}

const UsersPage: FC = () => {
  const [userId, setUserId] = useState<number | undefined>()
  const userListRef = useRef<UsersListHandle>(null)
  return (
    <SplitPane
      split="vertical"
      minSize={180}
      defaultSize={480}
      className={styles.splitpane}
    >
      <div className={styles.pre_pane}>
        <div className={styles.pane}>
          <UsersList
            ref={userListRef}
            onItemClickId={setUserId}
            template={user_template}
          />
        </div>
      </div>
      <div className={styles.pre_pane}>
        <div className={styles.pane}>
          <UserDetails
            userId={userId}
            template={user_template}
            onUpdate={userListRef.current?.refetch}
          />
        </div>
      </div>
    </SplitPane>
  )
}

export default UsersPage
