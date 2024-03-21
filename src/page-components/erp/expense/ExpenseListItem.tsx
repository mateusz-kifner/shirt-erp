import { DefaultListItem } from "@/components/DefaultListItem";
import { DefaultListItemExtended } from "@/components/DefaultListItemExtended";
import { useExperimentalContext } from "@/context/experimentalContext";
import type { Expense } from "@/server/api/expense/validator";
import type { ListItemProps } from "@/types/ListItemProps";
import { truncString } from "@/utils/truncString";

const ExpenseListItem = (props: ListItemProps<Expense>) => {
  const value = props.value;

  const { extendedList } = useExperimentalContext();
  const ListItem = extendedList ? DefaultListItemExtended : DefaultListItem;

  return (
    <ListItem
      firstElement={value ? value?.name && truncString(value.name, 20) : "⸺"}
      secondElement={
        value ? value?.cost && truncString(value.cost?.toString(), 20) : "⸺"
      }
      avatarElement={value.name?.substring(0, 2)}
      {...props}
    />
  );
};

export default ExpenseListItem;
