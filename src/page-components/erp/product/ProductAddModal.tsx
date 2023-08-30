import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableText from "@/components/editable/EditableText";
import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { Product } from "@/schema/productZodSchema";
import { api } from "@/utils/api";
import { omit } from "lodash";
import ProductListItem from "./ProductListItem";

interface ProductAddModalProps {
  opened: boolean;
  onClose: (id?: number) => void;
}

const ProductAddModal = ({ opened, onClose }: ProductAddModalProps) => {
  const router = useRouter();
  const [productName, setProductName] = useState<string>("Produkt");
  const [template, setTemplate] = useState<Partial<Product> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mutate: createProduct } = api.product.create.useMutation({
    onSuccess(data) {
      // router.push(`/erp/product/${data.id}`).catch((e) => {
      //   throw e;
      // });
      onClose(data.id);
    },
    onError(error) {
      setError("Produkt o takiej nazwie już istnieje.");
    },
  });

  useEffect(() => {
    if (!opened) {
      setProductName("Produkt");
      // setTemplate(null);
      setError(null);
    }
  }, [opened]);

  return (
    <Dialog open={opened} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogTitle>Utwórz nowy produkt</DialogTitle>
        <div className="flex flex-col gap-2">
          <EditableApiEntry
            label="Szablon"
            entryName="products"
            Element={ProductListItem}
            onSubmit={setTemplate}
            value={template ?? undefined}
            allowClear
            listProps={{ defaultSearch: "Szablon", filterKeys: ["username"] }}
          />
          <EditableText
            label="Nazwa użytkownika"
            onSubmit={(val) => {
              val && setProductName(val);
            }}
            value={productName}
            required
          />

          <Button
            onClick={() => {
              if (productName.length == 0)
                return setError("Musisz podać nie pustą nazwę produktu");
              const new_product = {
                ...(template ? omit(template, "id") : {}),
                name: productName,
                orders: [],
                "orders-archive": [],
              };

              createProduct({ name: productName });
            }}
            className="mt-4"
          >
            <IconPlus />
            Utwórz produkt
          </Button>
          <div className="text-red-600">{error}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductAddModal;
