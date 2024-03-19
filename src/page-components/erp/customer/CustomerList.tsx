import _ from "lodash";
import { useRouter } from "next/router";

import ApiList from "@/components/ApiList";
import useTranslation from "@/hooks/useTranslation";
import { type RouterNames } from "@/utils/trpc";
import CustomerListItem from "./CustomerListItem";

const entryName: RouterNames = "customer";

export const customerListSearchParams = {
  filterKeys: ["username", "firstname", "email", "companyName"],
  sortColumn: "username",
  excludeKey: "username",
  excludeValue: "Szablon",
};

interface CustomerListProps {
  selectedId: number | null;
  onAddElement?: () => void;
}

const CustomersList = ({ selectedId, onAddElement }: CustomerListProps) => {
  const router = useRouter();
  const t = useTranslation();

  return (
    <ApiList
      ListItem={CustomerListItem}
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
      {...customerListSearchParams}
    />
  );
};

export default CustomersList;
