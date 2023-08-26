import { DefaultListItem } from "@/components/DefaultListItem";
import { Expense } from "@/db/schema/expenses";
import { truncString } from "@/utils/truncString";

interface ExpenseListItemProps {
  onChange?: (item: Partial<Expense>) => void;
  value: Partial<Expense>;
  active?: boolean;
  disabled?: boolean;
}

const ExpenseListItem = (props: ExpenseListItemProps) => {
  const value = props.value;
  return (
    <DefaultListItem
      firstElement={value ? value?.name && truncString(value.name, 20) : "⸺"}
      secondElement={
        value ? value?.cost && truncString(value.cost?.toString(), 20) : "⸺"
      }
      avatarElement={value?.name && value.name.substring(0, 2)}
      {...props}
    />
  );
};

export default ExpenseListItem;
