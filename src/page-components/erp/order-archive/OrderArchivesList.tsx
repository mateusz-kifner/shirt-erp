import { capitalize } from "lodash";
import { useRouter } from "next/router";

import ApiList from "@/components/ApiList";
import useTranslation from "@/hooks/useTranslation";
import { type RouterNames } from "@/utils/api";
import OrderListItem from "../order/OrderListItem";

const entryName: RouterNames = "order-archive";

export const orderListSearchParams = {
  filterKeys: ["name", "notes"],
  excludeKey: "name",
  excludeValue: "Szablon",
};

interface OrderListProps {
  selectedId: number | null;
  onAddElement?: () => void;
}

const OrderArchivesList = ({ selectedId }: OrderListProps) => {
  const router = useRouter();
  const t = useTranslation();

  return (
    <ApiList
      ListItem={OrderListItem}
      entryName={entryName}
      label={entryName ? capitalize(t[entryName].plural) : undefined}
      selectedId={selectedId}
      onChange={(val: { id: number }) => {
        void router.push(`/erp/${entryName}/${val.id}`);
      }}
      listItemProps={{
        linkTo: (val: { id: number }) => `/erp/${entryName}/${val.id}`,
      }}
      {...orderListSearchParams}
    />
  );
};

export default OrderArchivesList;
