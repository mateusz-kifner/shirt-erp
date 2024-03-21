import Editable, { type Key } from "@/components/editable/Editable";
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
import type { Product } from "@/server/api/product/validator";
import type { User } from "@/server/api/user/validator";
import { trpc } from "@/utils/trpc";
import { truncString } from "@/utils/truncString";
import {
  IconAddressBook,
  IconCash,
  IconExternalLink,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { customerListSearchParams } from "../customer/CustomerList";
import CustomerListItem from "../customer/CustomerListItem";
import ProductListItem from "../product/ProductListItem";
import UserListItem from "../user/UserListItem";

interface TaskViewProps {
  id: number | null;
}

function TaskView(props: TaskViewProps) {
  const { id } = props;
  const isLoaded = useLoaded();
  const router = useRouter();

  const { data, refetch } = trpc.order.getById.useQuery(id as number, {
    enabled: id !== null,
  });
  const { mutateAsync: update } = trpc.order.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiUpdate = (key: Key, val: any) => {
    if (!isLoaded) return;
    if (!data) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    update({ id: data.id, [key]: val }).catch(console.log);
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
        <Wrapper
          keyName="name" // hint for Editable
          wrapperClassName="flex gap-2 items-center"
          wrapperRightSection={
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              onClick={() => {
                router.push(`/erp/order/${id}`).catch(console.log);
              }}
            >
              <IconExternalLink />
            </Button>
          }
          disabled
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
          keyName="customer"
          label="Klient"
          entryName="customer"
          linkEntry
          allowClear
          listProps={customerListSearchParams}
          Element={CustomerListItem}
          disabled
        />

        <EditableAddress
          label="Adres"
          keyName="address"
          leftSection={<IconAddressBook />}
          disabled
        />

        <EditableArray<Product> label="Produkty" keyName="products" disabled>
          <EditableApiEntry
            linkEntry
            entryName="product"
            Element={ProductListItem}
            copyProvider={(value: Product | null) =>
              value?.name ? truncString(value.name, 40) : undefined
            }
            allowClear
          />
        </EditableArray>
        <EditableArray<User> label="Pracownicy" keyName="employees" disabled>
          <EditableApiEntry
            linkEntry
            entryName="user"
            Element={UserListItem}
            copyProvider={(value: { username?: string } | null) =>
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
