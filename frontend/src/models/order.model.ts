import { ClientType } from "../types/ClientType"
import { OrderType } from "../types/OrderType"

export default {
  id: { type: "id" },

  name: {
    label: "Nazwa",
    type: "text",
    initialValue: "",
    required: true,
  },
  status: {
    label: "Status",
    type: "enum",
    initialValue: "planned",
    enum_data: [
      "planned",
      "accepted",
      "in production",
      "wrapped",
      "sent",
      "rejected",
      "archived",
    ],
  },
  notes: {
    label: "Notatki",
    type: "richtext",
    initialValue: "",
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
  dateOfCompletion: {
    label: "Data ukończenia",
    type: "date",
  },
  secretNotes: {
    label: "Sekretne notatki",
    type: "secrettext",
    initialValue: "",
  },
  files: {
    label: "Pliki",
    type: "files",
    initialValue: [],
  },
  client: {
    label: "Klient",
    type: "apiEntry",
    entryName: "clients",
    linkEntry: true,
    helpTooltip:
      "Jeśli adres jest całkowicie pusty to ustawienie Klienta spowoduje automatyczne wypełnienie adresu.",
    allowClear: true,
    onSubmitTrigger: (
      key: string,
      client: ClientType,
      data: OrderType,
      onSubmit: (key: string, value: any) => void
    ) => {
      if (
        data.address === null ||
        (!data.address.streetName &&
          !data.address.streetNumber &&
          !data.address.apartmentNumber &&
          !data.address.postCode &&
          !data.address.city &&
          !data.address.secondLine)
      ) {
        onSubmit?.("address", { ...client.address, id: undefined })
      }
    },
  },
  address: {
    label: {
      streetName: "Ulica",
      streetNumber: "Nr. bloku",
      apartmentNumber: "Nr. mieszkania",
      city: "Miasto",
      province: "Województwo",
      postCode: "Kod pocztowy",
      name: "Adres",
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
    type: "array",
    arrayType: "apiEntry",
    entryName: "products",
    // organizingHandle: "arrows",
    linkEntry: true,
  },

  employees: {
    label: "Pracownicy",
    type: "array",
    arrayType: "apiEntry",
    entryName: "users",
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
