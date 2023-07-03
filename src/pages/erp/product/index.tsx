import { useState } from "react";

import { useMediaQuery } from "@mantine/hooks";
import { IconList, IconNotebook } from "@tabler/icons-react";
import { useRouter } from "next/router";

import ApiEntryEditable from "@/components/ApiEntryEditable";
import Workspace from "@/components/Workspace";
import ProductAddModal from "@/page-components/erp/product/ProductAddModal";
import ProductsList from "@/page-components/erp/product/ProductList";
import template from "@/templates/product.template.json";
import { getQueryAsIntOrNull } from "@/utils/query";

const entryName = "product";

const ProductsPage = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)"
  );
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        childrenLabels={
          id ? ["Lista produktów", "Właściwości"] : ["Lista produktów"]
        }
        childrenIcons={[IconList, IconNotebook]}
        defaultActive={id ? 1 : 0}
        defaultPinned={isMobile ? [] : id ? [0] : []}
      >
        <ProductsList
          selectedId={id}
          onAddElement={() => setOpenAddModal(true)}
        />
        <ApiEntryEditable
          template={template}
          entryName={entryName}
          id={id}
          allowDelete
        />
      </Workspace>
      <ProductAddModal
        opened={openAddModal}
        onClose={(id?: number) => {
          setOpenAddModal(false);
          id !== undefined &&
            router.push(`/erp/product/${id}`).catch((e) => {
              throw e;
            });
        }}
      />
    </div>
  );
};

export default ProductsPage;
