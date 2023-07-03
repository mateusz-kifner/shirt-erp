import { capitalize } from "lodash";
import { useRouter } from "next/router";

import ApiList from "@/components/ApiList";
import useTranslation from "@/hooks/useTranslation";
import { type RouterNames } from "@/utils/api";
import UserListItem from "./UserListItem";

const entryName: RouterNames = "user";

export const userListSearchParams = {
  filterKeys: ["username", "name", "email"],
  sortColumn: "username",
  excludeKey: "username",
  excludeValue: "Szablon",
};

interface UserListProps {
  selectedId: number | null;
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
        router.push(`/erp/${entryName}/${val.id}`).catch((e) => {
          throw e;
        });
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
