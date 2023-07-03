import { capitalize } from "lodash";
import { useRouter } from "next/router";

import ApiList from "@/components/ApiList";
import useTranslation from "@/hooks/useTranslation";
import { type RouterNames } from "@/utils/api";
import ClientListItem from "./ClientListItem";

const entryName: RouterNames = "client";

export const clientListSearchParams = {
  filterKeys: ["username", "firstname", "email", "companyName"],
  sortColumn: "username",
  excludeKey: "username",
  excludeValue: "Szablon",
};

interface ClientListProps {
  selectedId: number | null;
  onAddElement?: () => void;
}

const ClientsList = ({ selectedId, onAddElement }: ClientListProps) => {
  const router = useRouter();
  const t = useTranslation();
  console.log(
    entryName,
    entryName ? capitalize(t[entryName].plural) : undefined
  );

  return (
    <ApiList
      ListItem={ClientListItem}
      entryName={entryName}
      label={entryName ? capitalize(t[entryName].plural) : undefined}
      selectedId={selectedId}
      onChange={(val: { id: number }) => {
        router.push(`/erp/${entryName}/${val.id}`).catch((e) => {
          throw e;
        });
      }}
      listItemProps={{
        linkTo: (val: { id: number }) => `/erp/${entryName}/${val.id}`,
      }}
      onAddElement={onAddElement}
      showAddButton
      {...clientListSearchParams}
    />
  );
};

export default ClientsList;
