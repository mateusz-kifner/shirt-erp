import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableText from "@/components/editable/EditableText";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { type OrderType } from "@/schema/orderSchema";
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
  const [template, setTemplate] = useState<Partial<OrderType> | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    <Modal
      open={opened}
      onOpenChange={() => onClose()}
      title={<h3 className="mb-4">Utwórz nowe zamówienie</h3>}
    >
      <div className="flex flex-col gap-2">
        <EditableApiEntry
          label="Szablon"
          entryName="order"
          Element={OrderListItem}
          onSubmit={setTemplate}
          value={template}
          withErase
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
            const newOrder = {
              ...(template ? omit(template, "id") : {}),
              address: template?.address ? omit(template.address, "id") : null,
              name: orderName,
            };
            createOrder(newOrder);
          }}
          className="mt-4"
        >
          <IconPlus />
          Utwórz zamówienie
        </Button>
        <div className="text-red-600">{error}</div>
      </div>
    </Modal>
  );
};

export default OrderAddModal;
