import Editable from "@/components/editable/Editable2";
import EditableAddress from "@/components/editable/EditableAddress";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableRichText from "@/components/editable/EditableRichText";
import EditableShortText from "@/components/editable/EditableShortText";
import { api } from "@/utils/api";
import {
  IconAddressBook,
  IconBuildingFactory,
  IconMail,
  IconNote,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
//TODO: Remake Array type

interface ClientEditableProps {
  id: number | null;
}

function ClientEditable(props: ClientEditableProps) {
  const { id } = props;

  const { data, refetch } = api.client.getById.useQuery(id as number, {
    enabled: id !== null,
  });
  const { mutateAsync: update } = api.client.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });
  const { mutateAsync: deleteById } = api.client.deleteById.useMutation();

  if (!data)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        Brak danych
      </div>
    );
  console.log(data);
  return (
    <Editable data={data} onSubmit={(key, value) => console.log(key, value)}>
      <EditableDebugInfo label="ID: " keyName="id" />
      <EditableShortText keyName="username" required />
      <EditableShortText
        keyName="firstname"
        label="Imie"
        leftSection={<IconUser />}
      />
      <EditableShortText
        keyName="lastname"
        label="Nazwisko"
        leftSection={<IconUser />}
      />
      <EditableRichText
        keyName="notes"
        label="Notatki"
        leftSection={<IconNote />}
      />
      <EditableShortText
        keyName="email"
        label="Email"
        leftSection={<IconMail />}
      />
      <EditableShortText
        keyName="phoneNumber"
        label="Telefon"
        leftSection={<IconPhone />}
      />
      <EditableShortText
        keyName="companyName"
        label="Nazwa firmy"
        leftSection={<IconBuildingFactory />}
      />
      <EditableAddress
        label={{
          streetName: "Ulica",
          streetNumber: "Nr. bloku",
          apartmentNumber: "Nr. mieszkania",
          secondLine: "Dodatkowe dane adresata",
          city: "Miasto",
          province: "Województwo",
          postCode: "Kod pocztowy",
          name: "Address",
        }}
        keyName="address"
        leftSection={<IconAddressBook />}
      />

      {/* <EditableArray label="Zamówienia" arrayType="" linkEntry disabled  />  */}

      {/* orders: {
  label: "Zamówienia",
  type: "array",
  arrayType: "apiEntry",
  entryName: "orders",
  linkEntry: true,
  disabled: true,
}, */}

      {/* orderArchives: {
  label: "Zamówienia archiwizowane",
  type: "array",
  arrayType: "apiEntry",
  entryName: "orders-archive",
  linkEntry: true,
  disabled: true,
}, */}

      <EditableDateTime
        keyName="createdAt"
        label="Utworzono"
        disabled
        collapse
      />
      <EditableDateTime
        keyName="updatedAt"
        label="Edytowano"
        disabled
        collapse
      />
    </Editable>
  );
}

export default ClientEditable;
