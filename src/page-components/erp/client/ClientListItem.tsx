import { DefaultListItem } from "@/components/DefaultListItem";
import { type Client } from "@/schema/clientZodSchema";
import { type ListItemProps } from "@/types/ListItemProps";
import { truncString } from "@/utils/truncString";

const ClientListItem = (props: ListItemProps<Client>) => {
  const value = props.value;
  return (
    <DefaultListItem
      firstElement={
        value
          ? (value?.firstname && value.firstname?.length > 0) ||
            (value?.lastname && value.lastname?.length > 0)
            ? truncString(
                `${value.firstname ?? ""} ${value.lastname ?? ""}`,
                40,
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
