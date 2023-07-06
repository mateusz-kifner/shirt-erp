import { useEffect, useState } from "react";

import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";

import EditableApiEntry from "@/components/editable/EditableApiEntry";
import EditableText from "@/components/editable/EditableText";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { type ProductType } from "@/schema/productSchema";
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
  const [template, setTemplate] = useState<Partial<ProductType> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mutate: createProduct } = api.product.create.useMutation({
    onSuccess(data) {
      // router.push(`/erp/product/${data.id}`).catch((e) => {
      //   throw e;
      // });
      onClose(data.id);
    },
    onError(error) {
      //setError("Produkt o takiej nazwie istnieje.");
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
    <Modal
      open={opened}
      onOpenChange={() => onClose()}
      title={<h3 className="mb-4">Utwórz nowy produkt</h3>}
    >
      <div className="flex flex-col gap-2">
        <EditableApiEntry
          label="Szablon"
          entryName="products"
          Element={ProductListItem}
          onSubmit={setTemplate}
          value={template}
          withErase
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
    </Modal>
  );
};

export default ProductAddModal;
