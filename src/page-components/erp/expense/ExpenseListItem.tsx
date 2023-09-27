import { DefaultListItem } from "@/components/DefaultListItem";
import { type Expense } from "@/schema/expenseZodSchema";
import { type ListItemProps } from "@/types/ListItemProps";
import { truncString } from "@/utils/truncString";

const ExpenseListItem = (props: ListItemProps<Expense>) => {
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
