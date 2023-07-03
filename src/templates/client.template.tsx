import {
  IconAddressBook,
  IconBuildingFactory2,
  IconMail,
  IconNote,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";

const clientTemplate = {
  id: { type: "id" },

  username: {
    type: "title",
    initialValue: "",
    required: true,
  },

  firstname: {
    label: "Imię",
    type: "text",
    initialValue: "",
    leftSection: <IconUser />,
  },

  lastname: {
    label: "Nazwisko",
    type: "text",
    initialValue: "",
    leftSection: <IconUser />,
  },

  notes: {
    label: "Notatki",
    type: "richtext",
    initialValue: "",
    leftSection: <IconNote />,
  },

  email: {
    label: "Email",
    type: "text",
    initialValue: "",
    leftSection: <IconMail />,
  },

  phoneNumber: {
    label: "Telefon",
    type: "text",
    initialValue: "",
    leftSection: <IconPhone />,
  },

  companyName: {
    label: "Nazwa firmy",
    type: "text",
    initialValue: "",
    leftSection: <IconBuildingFactory2 />,
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
      name: "Address",
    },
    type: "address",
    initialValue: {
      streetName: "",
      streetNumber: "",
      apartmentNumber: "",
      secondLine: "",
      city: "",
      province: "",
      postCode: "",
    },
    leftSection: <IconAddressBook />,
  },

  orders: {
    label: "Zamówienia",
    type: "array",
    arrayType: "apiEntry",
    entryName: "orders",
    linkEntry: true,
  },

  orderArchives: {
    label: "Zamówienia archiwizowane",
    type: "array",
    arrayType: "apiEntry",
    entryName: "orders-archive",
    linkEntry: true,
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

export default clientTemplate;
