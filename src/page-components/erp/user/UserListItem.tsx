import { DefaultListItem } from "@/components/DefaultListItem";
import { User } from "@/schema/userZodSchema";
import { truncString } from "@/utils/truncString";

interface UserListItemProps {
  onChange?: (item: Partial<User>) => void;
  value: Partial<User>;
  active?: boolean;
  disabled?: boolean;
}

const UserListItem = (props: UserListItemProps) => {
  const value = props.value;
  return (
    <DefaultListItem
      firstElement={value ? truncString(value?.name ?? "", 40) : "⸺"}
      secondElement={value ? truncString(value?.username ?? "", 40) : " "}
      avatarElement={`${value?.name?.[0] ?? ""}${
        value?.name?.split(" ")?.[1]?.[0] ?? ""
      }`}
      {...props}
    />
  );
};

export default UserListItem;
