import { capitalize } from "lodash";
import { useRouter } from "next/router";

import ApiList from "@/components/ApiList";
import useTranslation from "@/hooks/useTranslation";
import { type RouterNames } from "@/utils/api";
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
  console.log(
    entryName,
    entryName ? capitalize(t[entryName].plural) : undefined,
  );

  return (
    <ApiList
      ListItem={ExpenseListItem}
      entryName={entryName}
      label={entryName ? capitalize(t[entryName].plural) : undefined}
      selectedId={selectedId}
      onChange={(val: { id: number }) => {
        router.push(`/erp/${entryName}/${val.id}`).catch((e) => {
          throw e;
        });
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
