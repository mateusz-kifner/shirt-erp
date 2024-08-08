import ItemAvatar from "@/components/ItemAvatar";

interface CustomerAvatarProps {
  data: Record<string, any>;
}

function CustomerAvatar(props: CustomerAvatarProps) {
  const { data } = props;
  return (
    <ItemAvatar colorSeed={data.id}>
      {(data?.firstname && data.firstname.length > 0) ||
      (data?.lastname && data.lastname.length > 0)
        ? `${data?.firstname?.[0] ?? ""}${data?.lastname?.[0] ?? ""}`
        : data?.username?.substring(0, 2) ?? ""}
    </ItemAvatar>
  );
}

export default CustomerAvatar;
