import { DefaultListItem } from "@/components/DefaultListItem";
import { type User } from "@/schema/userZodSchema";
import { type ListItemProps } from "@/types/ListItemProps";
import { truncString } from "@/utils/truncString";

const UserListItem = (props: ListItemProps<User>) => {
  const value = props.value;
  return (
    <DefaultListItem
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
