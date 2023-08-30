import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableText from "@/components/editable/EditableText";
import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { type OrderWithoutRelations } from "@/schema/orderZodSchema";
import { api } from "@/utils/api";
import { omit } from "lodash";
import OrderListItem from "./OrderListItem";

interface OrderAddModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const OrderAddModal = ({ opened, onClose }: OrderAddModalProps) => {
  const [orderName, setOrderName] = useState<string>("Klient");
  const [template, setTemplate] =
    useState<Partial<OrderWithoutRelations> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data } = api.order.getById.useQuery(template?.id as number, {
    enabled: template !== null && template.id !== undefined,
  });

  const { mutateAsync: createOrder } = api.order.create.useMutation();

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
            value={template ?? undefined}
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
                name: orderName,
              } as any;
              if (data?.address) {
                newOrder.address = omit(data.address, "id");
              }
              createOrder(newOrder)
                .then((data) => {
                  onClose(data.id);
                })
                .catch((e) => console.log(e));
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
