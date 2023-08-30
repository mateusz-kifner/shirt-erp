import { DefaultListItem } from "@/components/DefaultListItem";
import { type Product } from "@/schema/productZodSchema";
import { type ListItemProps } from "@/types/ListItemProps";
import { truncString } from "@/utils/truncString";

const ProductListItem = (props: ListItemProps<Product>) => {
  const value = props.value;
  return (
    <DefaultListItem
      firstElement={value?.name ? truncString(value?.name ?? "", 40) : "⸺"}
      secondElement={
        ""
        // (value?. ? truncString(value.price, 20) : "")
      }
      avatarElement={value?.name ? value?.name?.substring(0, 2) : ""}
      {...props}
    />
  );
};

export default ProductListItem;
