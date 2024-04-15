import ItemAvatar from "@/components/ItemAvatar";

interface ProductAvatarProps {
  data: Record<string, any>;
}

function ProductAvatar(props: ProductAvatarProps) {
  const { data } = props;
  return (
    <ItemAvatar colorSeed={data.id}>
      {typeof data?.name === "string" ? data.name.substring(0, 2) : ""}
    </ItemAvatar>
  );
}

export default ProductAvatar;
