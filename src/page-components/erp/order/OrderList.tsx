import _ from "lodash";
import { useRouter } from "next/router";

import ApiListArchive from "@/components/ApiListArchive";
import useTranslation from "@/hooks/useTranslation";
import { type RouterNames } from "@/utils/trpc";
import OrderListItem from "./OrderListItem";

const entryName: RouterNames = "order";

export const orderListSearchParams = {
  filterKeys: ["name", "notes"],
  excludeKey: "name",
  excludeValue: "Szablon",
};

interface OrderListProps {
  selectedId: number | null;
  onAddElement?: () => void;
}

const OrdersList = ({ selectedId, onAddElement }: OrderListProps) => {
  const router = useRouter();
  const t = useTranslation();

  return (
    <ApiListArchive
      ListItem={OrderListItem}
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
      {...orderListSearchParams}
    />
  );
};

export default OrdersList;
