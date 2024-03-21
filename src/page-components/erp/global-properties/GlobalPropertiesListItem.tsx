import { DefaultListItem } from "@/components/DefaultListItem";
import { DefaultListItemExtended } from "@/components/DefaultListItemExtended";
import { useExperimentalContext } from "@/context/experimentalContext";
import type { GlobalProperties } from "@/server/api/global-property/validator";
import type { ListItemProps } from "@/types/ListItemProps";
import { truncString } from "@/utils/truncString";

const GlobalPropertiesListItem = (props: ListItemProps<GlobalProperties>) => {
  const value = props.value;

  const { extendedList } = useExperimentalContext();
  const ListItem = extendedList ? DefaultListItemExtended : DefaultListItem;

  return (
    <ListItem
      firstElement={
        value ? value?.category && truncString(value.category, 20) : "⸺"
      }
      secondElement={
        value ? value?.name && truncString(value.name?.toString(), 20) : "⸺"
      }
      avatarElement={value.name?.substring(0, 2)}
      {...props}
    />
  );
};

export default GlobalPropertiesListItem;
