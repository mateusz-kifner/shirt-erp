import { DefaultListItem } from "@/components/DefaultListItem";
import { type ClientType } from "@/schema/clientSchema";
import { truncString } from "@/utils/truncString";

interface ClientListItemProps {
  onChange?: (item: Partial<ClientType>) => void;
  value: Partial<ClientType>;
  active?: boolean;
  disabled?: boolean;
}

const ClientListItem = (props: ClientListItemProps) => {
  const value = props.value;
  return (
    <DefaultListItem
      firstElement={
        value
          ? (value?.firstname && value.firstname?.length > 0) ||
            (value?.lastname && value.lastname?.length > 0)
            ? truncString(
                `${value.firstname ?? ""} ${value.lastname ?? ""}`,
                40
              )
            : truncString(value?.username ?? "", 40)
          : "⸺"
      }
      secondElement={
        (value?.email ? truncString(value.email, 20) : "") +
        (value?.email || value?.companyName ? " | " : "") +
        (value?.companyName ? truncString(value.companyName, 20) : "")
      }
      avatarElement={
        (value?.firstname && value.firstname.length > 0) ||
        (value?.lastname && value.lastname.length > 0)
          ? `${value?.firstname?.[0] ?? ""}${value?.lastname?.[0] ?? ""}`
          : value?.username?.substring(0, 2) ?? ""
      }
      {...props}
    />
  );
};

export default ClientListItem;
