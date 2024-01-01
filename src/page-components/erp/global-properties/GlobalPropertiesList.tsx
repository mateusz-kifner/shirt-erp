import { capitalize } from "lodash";
import { useRouter } from "next/router";

import ApiList from "@/components/ApiList";
import useTranslation from "@/hooks/useTranslation";
import { type RouterNames } from "@/utils/api";
import GlobalPropertiesListItem from "./GlobalPropertiesListItem";

const entryName: RouterNames = "global-properties";

export const globalPropertiesListSearchParams = {
  filterKeys: ["name"],
  sortColumn: "name",
  excludeKey: "name",
  excludeValue: "Szablon",
};

interface GlobalPropertiesListProps {
  selectedId: number | null;
  onAddElement?: () => void;
}

const GlobalPropertiesList = ({
  selectedId,
  onAddElement,
}: GlobalPropertiesListProps) => {
  const router = useRouter();
  const t = useTranslation();

  return (
    <ApiList
      ListItem={GlobalPropertiesListItem}
      entryName={entryName}
      label={entryName ? capitalize(t[entryName].plural) : undefined}
      selectedId={selectedId}
      onChange={(val: { id: number }) => {
        void router.push(`/erp/${entryName}/${val.id}`);
      }}
      listItemProps={{
        linkTo: (val: { id: number }) => `/erp/${entryName}/${val.id}`,
      }}
      onAddElement={onAddElement}
      showAddButton
      {...globalPropertiesListSearchParams}
    />
  );
};

export default GlobalPropertiesList;
