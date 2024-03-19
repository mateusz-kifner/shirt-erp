import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableText from "@/components/editable/EditableText";
import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { type Product } from "@/server/api/product/validator";
import _ from "lodash";
import ProductListItem from "./ProductListItem";
import Editable from "@/components/editable/Editable";
import api from "@/hooks/api";

interface ProductAddModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const defaultProduct: {
  template: Partial<Product> | null;
  productName: string;
} = { template: null, productName: "Produkt" };

const ProductAddModal = ({ opened, onClose }: ProductAddModalProps) => {
  const [data, setData] = useState(defaultProduct);
  const [error, setError] = useState<string | null>(null);
  const { createProductAsync } = api.product.useCreate();

  useEffect(() => {
    if (!opened) {
      setData(defaultProduct);
      setError(null);
    }
  }, [opened]);

  return (
    <Dialog open={opened} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogTitle>Utwórz nowy produkt</DialogTitle>
        <Editable
          data={data}
          onSubmit={(key, val) => {
            setData((prev) => ({ ...prev, [key]: val }));
          }}
        >
          <EditableApiEntry
            label="Szablon"
            entryName="product"
            Element={ProductListItem}
            keyName="template"
            allowClear
            listProps={{ defaultSearch: "Szablon", filterKeys: ["username"] }}
          />
          <EditableText
            label="Nazwa użytkownika"
            keyName="productName"
            required
          />

          <Button
            onClick={() => {
              if (data.productName.length == 0)
                return setError("Musisz podać nie pustą nazwę produktu");
              const new_product = {
                ...(data.template ? _.omit(data.template, "id") : {}),
                name: data.productName,
                orders: [],
                "orders-archive": [],
              };

              createProductAsync(new_product)
                .then((data) => onClose(data.id))
                .catch(() => setError("Produkt o takiej nazwie już istnieje."));
            }}
            className="mt-4"
          >
            <IconPlus />
            Utwórz produkt
          </Button>
          <div className="text-red-600">{error}</div>
        </Editable>
      </DialogContent>
    </Dialog>
  );
};

export default ProductAddModal;
