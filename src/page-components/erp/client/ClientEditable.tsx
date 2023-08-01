import Editable from "@/components/editable/Editable2";
import EditableAddress from "@/components/editable/EditableAddress";
import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableArray from "@/components/editable/EditableArray2";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableRichText from "@/components/editable/EditableRichText";
import EditableShortText from "@/components/editable/EditableShortText";
import { OrderType } from "@/schema/orderSchema";
import { api } from "@/utils/api";
import { truncString } from "@/utils/truncString";
import {
  IconAddressBook,
  IconBuildingFactory,
  IconMail,
  IconNote,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import OrderListItem from "../order/OrderListItem";
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

      <EditableArray<OrderType> label="Zamówienia" keyName="orders">
        <EditableApiEntry
          linkEntry
          disabled
          entryName="order"
          Element={OrderListItem}
          copyProvider={(value: OrderType) =>
            value?.name ? truncString(value.name, 40) : undefined
          }
        />
      </EditableArray>
      <EditableArray<OrderType>
        label="Zamówienia archiwizowane"
        keyName="ordersArchive"
      >
        <EditableApiEntry
          linkEntry
          disabled
          entryName="order-archive"
          Element={OrderListItem}
          copyProvider={(value: OrderType) =>
            value?.name ? truncString(value.name, 40) : undefined
          }
        />
      </EditableArray>

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
