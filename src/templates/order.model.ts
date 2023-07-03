import { clientListSearchParams } from "@/page-components/erp/client/ClientList";
import { ClientType } from "@/schema/clientSchema";
import { OrderType } from "@/schema/orderSchema";

const order_template = {
  id: { type: "id" },

  name: {
    type: "title",
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
    disabled: false,
  },
  notes: {
    label: "Notatki",
    type: "richtext",
    initialValue: "",
  },
  price: {
    label: "Cena",
    type: "money",

    initialValue: "0",
  },
  isPricePaid: {
    label: "Cena zapłacona",
    type: "switch",
    initialValue: false,
    children: { checked: "Tak", unchecked: "Nie" },
  },
  dateOfCompletion: {
    label: "Data ukończenia",
    type: "date",
  },
  files: {
    label: "Pliki",
    type: "files",
    initialValue: [],
  },
  client: {
    label: "Klient",
    type: "apiEntry",
    entryName: "client",
    linkEntry: true,
    helpTooltip:
      "Jeśli adres jest całkowicie pusty to ustawienie Klienta spowoduje automatyczne wypełnienie adresu.",
    allowClear: true,
    listProps: clientListSearchParams,
    onSubmitTrigger: (
      key: string,
      client: ClientType,
      data: OrderType,
      onSubmit: (key: string, value: any) => void
    ) => {
      if (
        data.address === null ||
        (!data?.address?.streetName &&
          !data?.address?.streetNumber &&
          !data?.address?.apartmentNumber &&
          !data?.address?.postCode &&
          !data?.address?.city &&
          !data?.address?.secondLine)
      ) {
        onSubmit?.("address", { ...client.address, id: undefined });
      }
    },
  },
  address: {
    label: {
      streetName: "Ulica",
      streetNumber: "Nr. bloku",
      apartmentNumber: "Nr. mieszkania",
      secondLine: "Dodatkowe dane adresata",
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
      secondLine: "",
      city: "",
      province: "pomorskie",
      postCode: "",
    },
    allowClear: true,
  },
  products: {
    label: "Produkty",
    type: "array",
    arrayType: "apiEntry",
    entryName: "product",
    // organizingHandle: "arrows",
    linkEntry: true,
    allowClear: true,
  },

  employees: {
    label: "Pracownicy",
    type: "array",
    arrayType: "apiEntry",
    entryName: "user",
    allowClear: true,
  },
  workTime: {
    label: "Całkowity czas pracy",
    type: "number",
    initialValue: 0,
    min: 0,

    increment: 1,
    fixed: 0,
  },
  createdAt: {
    label: "Utworzono",
    type: "datetime",
    disabled: true,
    collapse: true,
  },

  updatedAt: {
    label: "Edytowano",
    type: "datetime",
    disabled: true,
    collapse: true,
  },
};

export default order_template;
