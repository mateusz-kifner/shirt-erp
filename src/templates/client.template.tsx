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
    initialValue: "",
    required: true,
  },

  firstname: {
    label: "Imię",
    type: "text",
    initialValue: "",
    leftSection: <UserIcon />,
  },

  lastname: {
    label: "Nazwisko",
    type: "text",
    initialValue: "",
    leftSection: <UserIcon />,
  },

  notes: {
    label: "Notatki",
    type: "richtext",
    initialValue: "",
    leftSection: <StickyNoteIcon />,
  },

  email: {
    label: "Email",
    type: "text",
    initialValue: "",
    leftSection: <MailIcon />,
  },

  phoneNumber: {
    label: "Telefon",
    type: "text",
    initialValue: "",
    leftSection: <PhoneIcon />,
  },

  companyName: {
    label: "Nazwa firmy",
    type: "text",
    initialValue: "",
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
    initialValue: {
      streetName: "",
      streetNumber: "",
      apartmentNumber: "",
      secondLine: "",
      city: "",
      province: "",
      postCode: "",
    },
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
