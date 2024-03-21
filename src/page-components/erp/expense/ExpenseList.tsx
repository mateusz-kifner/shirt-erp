import _ from "lodash";
import { useRouter } from "next/router";

import ApiList from "@/components/ApiList";
import useTranslation from "@/hooks/useTranslation";
import type { RouterNames } from "@/utils/trpc";
import ExpenseListItem from "./ExpenseListItem";

const entryName: RouterNames = "expense";

export const expenseListSearchParams = {
  filterKeys: ["name"],
  sortColumn: "name",
  excludeKey: "name",
  excludeValue: "Szablon",
};

interface ExpenseListProps {
  selectedId: number | null;
  onAddElement?: () => void;
}

const ExpensesList = ({ selectedId, onAddElement }: ExpenseListProps) => {
  const router = useRouter();
  const t = useTranslation();

  return (
    <ApiList
      ListItem={ExpenseListItem}
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
      {...expenseListSearchParams}
    />
  );
};

export default ExpensesList;
