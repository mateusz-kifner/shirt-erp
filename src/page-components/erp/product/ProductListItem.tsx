import { DefaultListItem } from "@/components/DefaultListItem";
import { type ProductType } from "@/schema/productSchema";
import { truncString } from "@/utils/truncString";

interface ProductListItemProps {
  onChange?: (item: Partial<ProductType>) => void;
  value: Partial<ProductType>;
  active?: boolean;
  disabled?: boolean;
}

const ProductListItem = (props: ProductListItemProps) => {
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
