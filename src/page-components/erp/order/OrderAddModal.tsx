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
import Editable from "@/components/editable/Editable";

interface OrderAddModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const defaultOrder: {
  orderName: string;
  template: Partial<OrderWithoutRelations> | null;
} = { orderName: "Zamówienie", template: null };

const OrderAddModal = ({ opened, onClose }: OrderAddModalProps) => {
  const [data, setData] = useState(defaultOrder);
  const [error, setError] = useState<string | null>(null);

  // const { data } = api.order.getById.useQuery(template?.id as number, {
  //   enabled: template !== null && template.id !== undefined,
  // });

  const { mutateAsync: createOrder } = api.order.createFull.useMutation();

  useEffect(() => {
    if (!opened) {
      setData(defaultOrder);
      setError(null);
    }
  }, [opened]);

  return (
    <Dialog open={opened} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogTitle>Utwórz nowe zamówienie</DialogTitle>
        <Editable
          data={data}
          onSubmit={(key, val) => {
            setData((prev) => ({ ...prev, [key]: val }));
          }}
        >
          <EditableApiEntry
            label="Szablon"
            entryName="order"
            Element={OrderListItem}
            keyName="template"
            allowClear
            listProps={{
              defaultSearch: "Szablon",
              filterKeys: ["name"],
              sortColumn: "name",
              excludeKey: undefined,
            }}
          />
          <EditableText label="Nazwa zamówienia" keyName="orderName" required />

          <Button
            onClick={() => {
              if (data.orderName.length == 0)
                return setError("Musisz podać nie pustą nazwę zamówienia");
              console.log;
              const newOrder = {
                ...(data.template ? omit(data.template, "id") : {}),
                name: data.orderName,
              } as OrderWithoutRelations;
              // if (data.template?.address) {
              //   newOrder.address = omit(data.template.address, "id");
              // }
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
        </Editable>
      </DialogContent>
    </Dialog>
  );
};

export default OrderAddModal;
