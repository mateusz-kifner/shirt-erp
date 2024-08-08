import Editable from "@/components/editable/Editable";
import EditableAddress from "@/components/editable/EditableAddress";
import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableArray from "@/components/editable/EditableArray";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableRichText from "@/components/editable/EditableRichText";
import EditableShortText from "@/components/editable/EditableShortText";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@shirterp/ui-web/AlertDialog";
import Button from "@shirterp/ui-web/Button";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import type { OrderWithoutRelations } from "@/server/api/order/validator";
import { truncString } from "@/utils/truncString";
import {
  IconAddressBook,
  IconBuildingFactory,
  IconMail,
  IconNote,
  IconPhone,
  IconUser,
  IconDotsVertical,
  IconTrashX,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import RefetchButton from "@shirterp/ui-web/RefetchButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@shirterp/ui-web/DropdownMenu";
import { useState } from "react";
import api from "@/hooks/api";

//TODO: Remake Array type

interface CustomerEditableProps {
  id: number | null;
}

function CustomerEditable(props: CustomerEditableProps) {
  const { id } = props;
  const isLoaded = useLoaded();
  const router = useRouter();
  const t = useTranslation();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data, refetch } = api.customer.useGetById(id);

  const { updateCustomerAsync } = api.customer.useUpdate({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });

  const { deleteCustomerAsync } = api.customer.useDelete();

  const apiUpdate = (key: string | number, val: any) => {
    if (!isLoaded) return;
    if (!data) return;
    updateCustomerAsync({ id: data.id, [key]: val }).catch(console.log);
  };

  const apiDelete = () => {
    if (!data) return;
    deleteCustomerAsync(data.id)
      .then(() => {
        router.push("/erp/customer").catch(console.log);
      })
      .catch(console.log);
  };

  if (!data)
    return (
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
        Brak danych
      </div>
    );

  return (
    <>
      <Editable data={data} onSubmit={apiUpdate}>
        <EditableDebugInfo label="ID: " keyName="id" />
        <div className="flex items-center gap-2">
          <RefetchButton onClick={() => void refetch()} />
          <EditableShortText
            keyName="username"
            leftSection={data.isTemplate ? "Szablon" : undefined}
            required
            style={{ fontSize: "1.4em" }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <IconDotsVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-22 max-w-md">
              <DropdownMenuCheckboxItem
                onClick={() => apiUpdate("isTemplate", !data.isTemplate)}
                checked={data.isTemplate ?? false}
              >
                {t.template}
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteModalOpen(true)}
                className="flex gap-2 focus:bg-destructive focus:text-destructive-foreground"
              >
                {t.delete} {t.customer.singular} <IconTrashX size={18} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
          label="Adres"
          keyName="addressId"
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
            // Element={OrderListItem}
            copyProvider={(value: OrderWithoutRelations | null) =>
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
            // Element={OrderListItem}
            copyProvider={(value: OrderWithoutRelations | null) =>
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
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription>
              {t.operation_not_reversible}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={apiDelete} variant="destructive">
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default CustomerEditable;
