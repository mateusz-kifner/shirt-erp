import Editable from "@/components/editable/Editable";
import EditableAddress from "@/components/editable/EditableAddress";
import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableArray from "@/components/editable/EditableArray";
import EditableDate from "@/components/editable/EditableDate";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableEnum from "@/components/editable/EditableEnum";
import EditableFiles from "@/components/editable/EditableFiles";
import EditableRichText from "@/components/editable/EditableRichText";
import EditableShortText from "@/components/editable/EditableShortText";
import EditableSwitch from "@/components/editable/EditableSwitch";
import Button from "@/components/ui/Button";
import Wrapper from "@/components/ui/Wrapper";
import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import { ProductType } from "@/schema/productSchema";
import { UserType } from "@/schema/userSchema";
import { api } from "@/utils/api";
import { truncString } from "@/utils/truncString";
import {
  IconAddressBook,
  IconCash,
  IconExternalLink,
} from "@tabler/icons-react";
import Logger from "js-logger";
import { useRouter } from "next/router";
import { clientListSearchParams } from "../client/ClientList";
import ClientListItem from "../client/ClientListItem";
import ProductListItem from "../product/ProductListItem";
import UserListItem from "../user/UserListItem";

interface TaskViewProps {
  id: number | null;
}

function TaskView(props: TaskViewProps) {
  const { id } = props;
  const isLoaded = useLoaded();
  const router = useRouter();
  const t = useTranslation();

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
                router.push(`/erp/order/${id}`).catch(Logger.warn);
              }}
            >
              <IconExternalLink />
            </Button>
          }
        >
          <EditableShortText
            keyName="name"
            required
            style={{ fontSize: "1.4em" }}
            disabled
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
          disabled
        />
        <EditableSwitch keyName="isPricePaid" label="Cena zapłacona" disabled />

        <EditableDate
          keyName="dateOfCompletion"
          label="Data ukończenia"
          disabled
        />
        <EditableFiles keyName="files" label="Pliki" disabled />
        <EditableApiEntry
          keyName="client"
          entryName="client"
          linkEntry
          allowClear
          listProps={clientListSearchParams}
          Element={ClientListItem}
          disabled
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
          disabled
        />

        <EditableArray<ProductType>
          label="Produkty"
          keyName="products"
          disabled
        >
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
        <EditableArray<UserType>
          label="Pracownicy"
          keyName="employees"
          disabled
        >
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
      </Editable>
    </>
  );
}

export default TaskView;
