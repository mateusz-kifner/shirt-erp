import Editable from "@/components/editable/Editable";
import EditableAddress from "@/components/editable/EditableAddress";
import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableArray from "@/components/editable/EditableArray";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableRichText from "@/components/editable/EditableRichText";
import EditableShortText from "@/components/editable/EditableShortText";
import EditableSwitch from "@/components/editable/EditableSwitch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import Button from "@/components/ui/Button";
import Wrapper from "@/components/ui/Wrapper";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import { type OrderWithoutRelations } from "@/schema/orderZodSchema";
import { api } from "@/utils/api";
import { truncString } from "@/utils/truncString";
import {
  IconAddressBook,
  IconBuildingFactory,
  IconMail,
  IconNote,
  IconPhone,
  IconRefresh,
  IconUser,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import OrderListItem from "../order/OrderListItem";

//TODO: Remake Array type

interface ClientEditableProps {
  id: number | null;
}

function ClientEditable(props: ClientEditableProps) {
  const { id } = props;
  const isLoaded = useLoaded();
  const router = useRouter();
  const t = useTranslation();

  const { data, refetch } = api.client.getById.useQuery(id as number, {
    enabled: id !== null,
  });
  const { mutateAsync: update } = api.client.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });
  const { mutateAsync: deleteById } = api.client.deleteById.useMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiUpdate = (key: string | number, val: any) => {
    if (!isLoaded) return;
    if (!data) return;
    update({ id: data.id, [key]: val }).catch(console.log);
  };

  const apiDelete = () => {
    if (!data) return;
    deleteById(data.id)
      .then(() => {
        router.push(`/erp/client`).catch(console.log);
      })
      .catch(console.log);
  };

  if (!data)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        Brak danych
      </div>
    );

  return (
    <>
      <Editable data={data} onSubmit={apiUpdate}>
        <EditableDebugInfo label="ID: " keyName="id" />
        <Wrapper
          keyName="username" // hint for Editable
          wrapperClassName="flex gap-2 items-center"
          wrapperRightSection={
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              onClick={() => {
                refetch().catch(console.log);
              }}
            >
              <IconRefresh />
            </Button>
          }
        >
          <EditableShortText
            keyName="username"
            required
            style={{ fontSize: "1.4em" }}
          />
        </Wrapper>
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

        <EditableArray<OrderWithoutRelations>
          label="Zamówienia"
          keyName="orders"
          disabled
        >
          <EditableApiEntry
            linkEntry
            entryName="order"
            Element={OrderListItem}
            copyProvider={(value: OrderWithoutRelations) =>
              value?.name ? truncString(value.name, 40) : undefined
            }
          />
        </EditableArray>
        <EditableArray<OrderWithoutRelations>
          label="Zamówienia archiwizowane"
          keyName="ordersArchive"
          disabled
        >
          <EditableApiEntry
            linkEntry
            entryName="order-archive"
            Element={OrderListItem}
            copyProvider={(value: OrderWithoutRelations) =>
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
        <EditableSwitch keyName="isTemplate" label="Szablon" />
      </Editable>
      <AlertDialog>
        <AlertDialogTrigger asChild className="mt-6">
          <Button variant="destructive">
            {t.delete} {t.client.singular}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            {/* <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle> */}
            <AlertDialogDescription>
              {t.operation_not_reversible}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={apiDelete}>
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ClientEditable;
