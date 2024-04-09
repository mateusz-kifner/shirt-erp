import { trpc } from "@/utils/trpc";
import { useDebouncedValue } from "@mantine/hooks";
import { useId, useReducer, useState, type ReactNode } from "react";

interface queryOptionsType<TColumns extends string> {
  sort: { order: "asc" | "desc"; column?: TColumns };
  keys: string[];
  currentPage: number;
  itemsPerPage?: number;
}

type setSortActionType = {
  type: "setSort";
  payload: { order: "asc" | "desc"; column?: string };
};
type setKeysActionType = { type: "setKeys"; payload: string[] };

type queryActionsType = setSortActionType | setKeysActionType;

function queryReducer<T extends string>(
  state: queryOptionsType<T>,
  action: queryActionsType,
): queryOptionsType<T> {
  return state;
}

interface ApiListProps<T = any> {
  entryName: string;
  ListItem: React.ElementType;
  label?: string | ReactNode;
  onChange?: (val: T) => void;
  onRefresh?: () => void;
  listItemProps?: Record<string, any>;
  selectedId?: number | string | null;
  filterKeys?: string[];
  excludeKey?: string;
  excludeValue?: string;
  sortColumn?: string;
  onAddElement?: () => void;
  defaultSearch?: string;
  showAddButton?: boolean;
  buttonSection?: ReactNode;
}

function ApiList<T extends { id: number | string }>(props: ApiListProps) {
  const {
    entryName,
    label = "",
    onChange,
    onRefresh,
    ListItem,
    listItemProps = {},
    selectedId,
    filterKeys = [],
    onAddElement,
    showAddButton,
    buttonSection,
  } = props;

  const [query, setQuery] = useState<string | undefined>(undefined);
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [queryOptions, queryDispatch] = useReducer(queryReducer, {
    sort: { order: "desc", column: undefined },
    keys: filterKeys,
    currentPage: 1,
    itemsPerPage: undefined,
  });

  const { data, refetch } = trpc[entryName as "customer"].simpleSearch.useQuery(
    { ...queryOptions, query: debouncedQuery },
  );

  const uuid = useId();

  return <></>;
}

export default ApiList;
