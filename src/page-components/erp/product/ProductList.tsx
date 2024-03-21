import _ from "lodash";
import { useRouter } from "next/router";

import ApiList from "@/components/ApiList";
import useTranslation from "@/hooks/useTranslation";
import type { RouterNames } from "@/utils/trpc";
import ProductListItem from "./ProductListItem";

const entryName: RouterNames = "product";

export const productListSearchParams = {
  filterKeys: ["name", "category", "description"],
  sortColumn: "name",
  excludeKey: "name",
  excludeValue: "Szablon",
};

interface ProductListProps {
  selectedId: number | null;
  onAddElement?: () => void;
}

const ProductsList = ({ selectedId, onAddElement }: ProductListProps) => {
  const router = useRouter();
  const t = useTranslation();

  return (
    <ApiList
      ListItem={ProductListItem}
      entryName={entryName}
      label={entryName ? _.capitalize(t[entryName].plural) : undefined}
      selectedId={selectedId}
      onChange={(val: { id: number }) => {
        void router.push(`/erp/${entryName}/${val.id}`);
      }}
      listItemProps={{
        linkTo: (val: { id: number }) => `/erp/${entryName}/${val.id}`,
      }}
      onAddElement={onAddElement}
      showAddButton
      {...productListSearchParams}
    />
  );
};

export default ProductsList;
