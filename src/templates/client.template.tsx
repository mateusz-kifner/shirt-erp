import {
  IconAddressBook,
  IconBuildingFactory,
  IconMail,
  IconNote,
  IconPhone,
  IconUser
} from "@tabler/icons-react";

const clientTemplate = {
  id: { type: "id" },

  username: {
    type: "title",
    required: true,
  },

  firstname: {
    label: "Imię",
    type: "text",
    leftSection: <IconUser />,
  },

  lastname: {
    label: "Nazwisko",
    type: "text",
    leftSection: <IconUser />,
  },

  notes: {
    label: "Notatki",
    type: "richtext",
    leftSection: <IconNote />,
  },

  email: {
    label: "Email",
    type: "text",
    leftSection: <IconMail />,
  },

  phoneNumber: {
    label: "Telefon",
    type: "text",
    leftSection: <IconPhone />,
  },

  companyName: {
    label: "Nazwa firmy",
    type: "text",
    leftSection: <IconBuildingFactory />,
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
