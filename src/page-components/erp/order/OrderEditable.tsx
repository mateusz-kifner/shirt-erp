import Editable from "@/components/editable/Editable";
import EditableAddress from "@/components/editable/EditableAddress";
import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableArray from "@/components/editable/EditableArray";
import EditableDate from "@/components/editable/EditableDate";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableEnum from "@/components/editable/EditableEnum";
import EditableFiles from "@/components/editable/EditableFiles";
import EditableNumber from "@/components/editable/EditableNumber";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import Wrapper from "@/components/ui/Wrapper";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import { ClientType } from "@/schema/clientSchema";
import { ProductType } from "@/schema/productSchema";
import { UserType } from "@/schema/userSchema";
import { api } from "@/utils/api";
import { truncString } from "@/utils/truncString";
import {
  IconAddressBook,
  IconCash,
  IconCopy,
  IconRefresh,
} from "@tabler/icons-react";
import { omit } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { clientListSearchParams } from "../client/ClientList";
import ClientListItem from "../client/ClientListItem";
import ProductListItem from "../product/ProductListItem";
import UserListItem from "../user/UserListItem";

interface OrderEditableProps {
  id: number | null;
}

function OrderEditable(props: OrderEditableProps) {
  const { id } = props;
  const isLoaded = useLoaded();
  const router = useRouter();
  const t = useTranslation();
  const [orderAddressFromClient, setOrderAddressFromClient] = useState<
    number | null
  >(null);

  const { data, refetch } = api.order.getById.useQuery(id as number, {
    enabled: id !== null,
  });
  const { mutateAsync: update } = api.order.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });
  const { mutateAsync: deleteById } = api.order.deleteById.useMutation();

  const apiUpdate = (key: string, val: any) => {
    if (!isLoaded) return;
    if (!data) return;
    update({ id: data.id, [key]: val });
  };

  const apiDelete = () => {
    if (!data) return;
    deleteById(data.id).then(() => {
      router.push(`/erp/order`);
    });
  };

  // update address if it's not set to client one
  useEffect(() => {
    if (
      orderAddressFromClient !== null &&
      data?.clientId == orderAddressFromClient
    ) {
      data.client?.address &&
        apiUpdate("address", omit(data.client.address, ["id"]));
      setOrderAddressFromClient(null);
    }
  }, [orderAddressFromClient, data?.clientId]);

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
          keyName="name" // hint for Editable
          wrapperClassName="flex gap-2 items-center"
          wrapperRightSection={
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              onClick={() => {
                refetch();
              }}
            >
              <IconRefresh />
            </Button>
          }
        >
          <EditableShortText
            keyName="name"
            required
            style={{ fontSize: "1.4em" }}
          />
        </Wrapper>
        <EditableEnum
          label="Status"
          keyName="status"
          enum_data={[
            "planned",
            "accepted",
            "in production",
            "wrapped",
            "sent",
            "rejected",
            "archived",
          ]}
        />
        <EditableRichText label="Notatki" keyName="notes" />
        <EditableShortText
          keyName="price"
          label="Cena"
          leftSection={<IconCash />}
        />
        <EditableSwitch keyName="isPricePaid" label="Cena zapłacona" />
        <EditableDate keyName="dateOfCompletion" label="Data ukończenia" />
        <EditableFiles keyName="files" label="Pliki" />
        <EditableApiEntry
          keyName="client"
          entryName="client"
          linkEntry
          allowClear
          listProps={clientListSearchParams}
          Element={ClientListItem}
          onSubmit={(value: ClientType) => {
            // check if address is set
            if (
              data.address === null ||
              (!data.address.apartmentNumber &&
                !data.address.streetName &&
                !data.address.streetNumber &&
                !data.address.postCode &&
                !data.address.city &&
                !data.address.secondLine)
            )
              setOrderAddressFromClient(value.id);
          }}
        />
        <Wrapper
          keyName="address" // hint for Editable
          wrapperClassName="flex gap-2 items-end"
          wrapperRightSection={
            !!data.client && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => {
                      console.log(data.client);
                      !!data.client &&
                        apiUpdate("address", omit(data.client.address, ["id"]));
                    }}
                  >
                    <IconCopy />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Kopiuj adres z klienta</TooltipContent>
              </Tooltip>
            )
          }
        >
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
        </Wrapper>

        <EditableArray<ProductType> label="Produkty" keyName="products">
          <EditableApiEntry
            linkEntry
            entryName="product"
            Element={ProductListItem}
            copyProvider={(value: ProductType) =>
              value?.name ? truncString(value.name, 40) : undefined
            }
            allowClear
          />
        </EditableArray>
        <EditableArray<UserType> label="Pracownicy" keyName="employees">
          <EditableApiEntry
            linkEntry
            entryName="user"
            Element={UserListItem}
            copyProvider={(value: any) =>
              value?.username ? truncString(value.username, 40) : undefined
            }
            allowClear
          />
        </EditableArray>

        <EditableNumber
          label="Całkowity czas pracy"
          min={0}
          increment={1}
          fixed={0}
          keyName="workTime"
        />

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
      <AlertDialog>
        <AlertDialogTrigger asChild className="mt-6">
          <Button variant="destructive">
            {t.delete} {t.order.singular}
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

export default OrderEditable;
