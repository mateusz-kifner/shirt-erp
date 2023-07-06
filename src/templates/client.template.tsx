import {
  FactoryIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  StickyNoteIcon,
  UserIcon,
} from "lucide-react";

const clientTemplate = {
  id: { type: "id" },

  username: {
    type: "title",
    required: true,
  },

  firstname: {
    label: "Imię",
    type: "text",
    leftSection: <UserIcon />,
  },

  lastname: {
    label: "Nazwisko",
    type: "text",
    leftSection: <UserIcon />,
  },

  notes: {
    label: "Notatki",
    type: "richtext",
    leftSection: <StickyNoteIcon />,
  },

  email: {
    label: "Email",
    type: "text",
    leftSection: <MailIcon />,
  },

  phoneNumber: {
    label: "Telefon",
    type: "text",
    leftSection: <PhoneIcon />,
  },

  companyName: {
    label: "Nazwa firmy",
    type: "text",
    leftSection: <FactoryIcon />,
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
    leftSection: <MapPinIcon />,
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
