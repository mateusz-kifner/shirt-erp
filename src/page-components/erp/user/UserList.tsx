import { capitalize } from "lodash";
import { useRouter } from "next/router";

import ApiList from "@/components/ApiList";
import useTranslation from "@/hooks/useTranslation";
import { type RouterNames } from "@/utils/api";
import UserListItem from "./UserListItem";

const entryName: RouterNames = "user";

export const userListSearchParams = {
  filterKeys: ["name", "email"],
  sortColumn: "name",
  excludeKey: "name",
  excludeValue: "Szablon",
};

interface UserListProps {
  selectedId: string | null;
  onAddElement?: () => void;
}

const UsersList = ({ selectedId, onAddElement }: UserListProps) => {
  const router = useRouter();
  const t = useTranslation();

  return (
    <ApiList
      ListItem={UserListItem}
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
      {...userListSearchParams}
    />
  );
};

export default UsersList;
