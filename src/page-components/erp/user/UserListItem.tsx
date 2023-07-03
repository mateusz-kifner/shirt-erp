import { DefaultListItem } from "@/components/DefaultListItem";
import { type UserType } from "@/schema/userSchema";
import { truncString } from "@/utils/truncString";

interface UserListItemProps {
  onChange?: (item: Partial<UserType>) => void;
  value: Partial<UserType>;
  active?: boolean;
  disabled?: boolean;
}

const UserListItem = (props: UserListItemProps) => {
  const value = props.value;
  return (
    <DefaultListItem
      firstElement={value ? truncString(value?.name ?? "", 40) : "⸺"}
      secondElement={value ? truncString(value?.username ?? "", 40) : "⸺"}
      avatarElement={`${value?.name?.[0]}${value?.name?.split(" ")?.[1]?.[0]}`}
      {...props}
    />
  );
};

export default UserListItem;
