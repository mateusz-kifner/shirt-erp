import Editable, { Key } from "@/components/editable/Editable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { OrderWithoutRelations } from "@/schema/orderZodSchema";
import { api } from "@/utils/api";
import ClientListItem from "../client/ClientListItem";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import { clientListSearchParams } from "../client/ClientList";
import {
  IconAddressBook,
  IconMail,
  IconNote,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/Separator";
import DOMPurify from "dompurify";
import EditableApiEntryId from "@/components/editable/EditableApiEntryId";
import { addressToString } from "@/utils/addressToString";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import EditableAddress, {
  provinces,
} from "@/components/editable/EditableAddress";
import EditableEnum from "@/components/editable/EditableEnum";
import { useClipboard } from "@mantine/hooks";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import RefetchButton from "@/components/ui/RefetchButton";
import useTranslation from "@/hooks/useTranslation";
import { useLoaded } from "@/hooks/useLoaded";
import EditableText from "@/components/editable/EditableText";
import { Label } from "@/components/ui/Label";

interface OrderClientViewProps {
  orderApiUpdate: (key: string | number, value: any) => void;
  orderData?: OrderWithoutRelations;
  refetch?: () => void;
}

function OrderClientView(props: OrderClientViewProps) {
  const { orderData, orderApiUpdate, refetch } = props;

  const clientId = orderData?.clientId ?? null;
  const addressId = orderData?.addressId ?? null;
  const clipboard = useClipboard();
  const t = useTranslation();
  const isLoaded = useLoaded();

  const { data } = api.client.getById.useQuery(clientId as number, {
    enabled: clientId !== null,
  });

  const { data: addressData, refetch: addressRefetch } =
    api.address.getById.useQuery(addressId as number, {
      enabled: addressId !== null,
    });

  // const { mutateAsync: update } = api.client.update.useMutation({
  //   onSuccess: () => {
  //     refetch().catch((err) => console.log(err));
  //   },
  // });

  const { mutateAsync: updateAddress } = api.address.update.useMutation({
    onSuccess: () => {
      refetch?.();
      // .catch((err) => console.log(err));
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiUpdateAddress = (key: Key, val: any) => {
    console.log(key, val);
    if (!isLoaded) return;
    if (!addressData) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    updateAddress({ id: addressData.id, [key]: val }).catch(console.log);
  };

  const notes = data?.notes ? DOMPurify.sanitize(data.notes) : "";

  if (orderData === undefined) return <div>Loading ...</div>;

  const addressStringClient = addressToString(data?.address ?? undefined);
  const addressStringOrder = addressToString(
    (orderData as unknown as any)?.address ?? undefined,
  );

  const copy = (val?: string | null) => {
    if (!val) return;
    clipboard.copy(val);
    toast("Skopiowano do schowka", {
      description: val,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <RefetchButton onClick={() => refetch?.()} />
          Klient
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-4">
        <Editable data={orderData} onSubmit={orderApiUpdate}>
          <EditableDebugInfo label="ID: " keyName="id" />
          <EditableApiEntryId
            keyName="clientId"
            entryName="client"
            label="Klient"
            linkEntry
            allowClear
            listProps={clientListSearchParams}
            Element={ClientListItem}
          />
          <EditableEnum
            label="Odbiór"
            keyName="pickupMethod"
            enum_data={["not_set", "shipping", "in_person", "delivery"]}
          />
        </Editable>

        <Card className="flex flex-col gap-3 p-2">
          {data ? (
            <>
              <CardHeader>
                {data?.isTemplate ? (
                  <CardDescription>Szablon</CardDescription>
                ) : null}
                <CardTitle className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      copy(
                        (data?.firstname && data.firstname?.length > 0) ||
                          (data?.lastname && data.lastname?.length > 0)
                          ? `${data.firstname ?? ""} ${data.lastname ?? ""}`
                          : undefined,
                      )
                    }
                  >
                    <IconUser />
                  </Button>
                  {data?.firstname ?? ""} {data?.lastname ?? ""}
                </CardTitle>
                {data?.companyName ? (
                  <CardDescription>{data?.companyName}</CardDescription>
                ) : null}
              </CardHeader>

              <CardContent className="flex flex-col gap-2">
                <div className="flex items-stretch gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copy(data?.email)}
                    >
                      <IconMail />
                    </Button>
                    {data?.email ?? "⸺"}
                  </div>
                  <Separator orientation="vertical" className="h-9" />
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copy(data?.phoneNumber)}
                    >
                      <IconPhone />
                    </Button>

                    {data?.phoneNumber ?? "⸺"}
                  </div>
                  <Separator orientation="vertical" className="h-9" />
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copy(data?.username)}
                    >
                      <IconUser />
                    </Button>

                    {data?.username ?? "⸺"}
                  </div>
                </div>
                <Separator />

                <div className="flex items-stretch gap-4">
                  <div
                    className={`plain-html editor w-full leading-normal ${
                      notes.length === 0 ||
                      notes === "<p></p>" ||
                      notes === "<p></p><p></p>"
                        ? "text-gray-400 dark:text-stone-600"
                        : "text-stone-950 dark:text-stone-200"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html:
                        notes.length === 0 ||
                        notes === "<p></p>" ||
                        notes === "<p></p><p></p>"
                          ? "⸺"
                          : notes,
                    }}
                  ></div>
                </div>
              </CardContent>
            </>
          ) : (
            <div>⸺</div>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Adres Klienta</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre">
            {addressStringClient ?? "⸺"}{" "}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Adres z zamówienia</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre ">
            {addressData !== undefined && (
              <Editable data={addressData} onSubmit={apiUpdateAddress}>
                <EditableText
                  label={t.streetName}
                  keyName="streetName"
                  className="text-stone-800 dark:text-stone-200"
                />
                <div className="flex flex-grow gap-2">
                  <EditableText
                    label={t.streetNumber}
                    keyName="streetNumber"
                    className="text-stone-800 dark:text-stone-200"
                  />
                  <EditableText
                    label={t.apartmentNumber}
                    keyName="apartmentNumber"
                    className="text-stone-800 dark:text-stone-200"
                  />
                </div>
                <EditableText
                  label={t.secondLine}
                  keyName="secondLine"
                  className="text-stone-800 dark:text-stone-200"
                />
                <EditableText
                  label={t.postCode}
                  keyName="postCode"
                  className="text-stone-800 dark:text-stone-200"
                />
                <EditableText
                  label={t.city}
                  keyName="city"
                  className="text-stone-800 dark:text-stone-200"
                />
                <div className="flex flex-grow flex-col">
                  <Label label={t.province} />
                  <EditableEnum keyName="province" enum_data={provinces} />
                </div>
              </Editable>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

export default OrderClientView;
