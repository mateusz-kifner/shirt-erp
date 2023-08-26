import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableText from "@/components/editable/EditableText";
import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { api } from "@/utils/api";
import { omit } from "lodash";
import OrderListItem from "./OrderListItem";

interface OrderAddModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const OrderAddModal = ({ opened, onClose }: OrderAddModalProps) => {
  const router = useRouter();
  const [orderName, setOrderName] = useState<string>("Klient");
  const [template, setTemplate] = useState<Partial<Order> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data } = api.order.getById.useQuery(template?.id as number, {
    enabled: template !== null && template.id !== undefined,
  });

  const { mutate: createOrder } = api.order.create.useMutation({
    onSuccess(data) {
      // setTimeout(() => {
      //   router.push(`/erp/order/${data.id}`).catch((e) => {
      //     throw e;
      //   });
      // }, 400);
      onClose(data.id);
    },
    onError(error) {
      // setError("Klient o takiej nazwie istnieje.");
    },
  });

  useEffect(() => {
    if (!opened) {
      setOrderName("Zamówienie");
      // setTemplate(null);
      setError(null);
    }
  }, [opened]);

  return (
    <Dialog open={opened} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogTitle>Utwórz nowe zamówienie</DialogTitle>
        <div className="flex flex-col gap-2">
          <EditableApiEntry
            label="Szablon"
            entryName="order"
            Element={OrderListItem}
            onSubmit={setTemplate}
            value={template}
            allowClear
            listProps={{
              defaultSearch: "Szablon",
              filterKeys: ["name"],
              sortColumn: "name",
              excludeKey: undefined,
            }}
          />
          <EditableText
            label="Nazwa zamówienia"
            onSubmit={(val) => {
              val && setOrderName(val);
            }}
            value={orderName}
            required
          />

          <Button
            onClick={() => {
              if (orderName.length == 0)
                return setError("Musisz podać nie pustą nazwę zamówienia");
              console.log;
              const newOrder = {
                ...(data ? omit(data, "id") : {}),
                address: data?.address ? omit(data.address, "id") : null,
                name: orderName,
              } as any;
              createOrder(newOrder);
            }}
            className="mt-4"
          >
            <IconPlus />
            Utwórz zamówienie
          </Button>
          <div className="text-red-600">{error}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderAddModal;
