import { DefaultListItem } from "@/components/DefaultListItem";
import { DefaultListItemExtended } from "@/components/DefaultListItemExtended";
import { useExperimentalContext } from "@/context/experimentalContext";
import { type User } from "@/server/api/user/validator";
import { type ListItemProps } from "@/types/ListItemProps";
import { truncString } from "@/utils/truncString";

const UserListItem = (props: ListItemProps<User>) => {
  const value = props.value;

  const { extendedList } = useExperimentalContext();
  const ListItem = extendedList ? DefaultListItemExtended : DefaultListItem;

  return (
    <ListItem
      firstElement={value ? truncString(value?.name ?? "", 40) : "⸺"}
      secondElement={value ? truncString(value?.email ?? "", 40) : " "}
      avatarElement={`${value?.name?.[0] ?? ""}${
        value?.name?.split(" ")?.[1]?.[0] ?? ""
      }`}
      {...props}
    />
  );
};

export default UserListItem;
