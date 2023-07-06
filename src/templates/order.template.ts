import { clientListSearchParams } from "@/page-components/erp/client/ClientList";
import { type ClientType } from "@/schema/clientSchema";
import { type OrderType } from "@/schema/orderSchema";

const order_template = {
  id: { type: "id" },

  name: {
    type: "title",
    required: true,
  },
  status: {
    label: "Status",
    type: "enum",
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
  },
  price: {
    label: "Cena",
    type: "money",
    },
  isPricePaid: {
    label: "Cena zapłacona",
    type: "switch",
    children: { checked: "Tak", unchecked: "Nie" },
  },
  dateOfCompletion: {
    label: "Data ukończenia",
    type: "date",
  },
  files: {
    label: "Pliki",
    type: "files",
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
