import { DefaultListItem } from "@/components/DefaultListItem";
import { DefaultListItemExtended } from "@/components/DefaultListItemExtended";
import { useExperimentalContext } from "@/context/experimentalContext";
import type { Product } from "@/server/api/product/validator";
import type { ListItemProps } from "@/types/ListItemProps";
import { truncString } from "@/utils/truncString";

const ProductListItem = (props: ListItemProps<Product>) => {
  const value = props.value;

  const { extendedList } = useExperimentalContext();
  const ListItem = extendedList ? DefaultListItemExtended : DefaultListItem;

  return (
    <ListItem
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
