/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useId, useState, type ReactNode } from "react";

import { useDebouncedValue, useToggle } from "@mantine/hooks";
import {
  IconPlus,
  IconRefresh,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";

import List from "@/components/List";
import Pagination from "@/components/ui/Pagination";
import useTranslation from "@/hooks/useTranslation";
import { api } from "@/utils/api";
import Button from "./ui/Button";

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

const ApiList = <T extends { id: number | string }>(props: ApiListProps<T>) => {
  const {
    entryName,
    ListItem,
    label = "",
    onChange = (_val: T) => {
      /* no-op */
    },
    onRefresh = () => {
      /* no-op */
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    listItemProps = {},
    selectedId,
    filterKeys = [],
    excludeKey,
    excludeValue,
    onAddElement,
    defaultSearch,
    showAddButton,
    buttonSection,
    sortColumn,
  } = props;
  const uuid = useId();
  const itemsPerPage = 10;
  const t = useTranslation();
  const [sortOrder, toggleSortOrder] = useToggle<"asc" | "desc">([
    "asc",
    "desc",
  ]);
  const [query, setQuery] = useState<string | undefined>(defaultSearch);
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [page, setPage] = useState<number>(1);
  const { data, refetch } = api[entryName as "client"].search.useQuery({
    sort: sortOrder,
    keys: filterKeys,
    query: debouncedQuery,
    excludeKey,
    excludeValue,
    currentPage: page,
    sortColumn,
    itemsPerPage,
  });

  const items = data?.results as Record<string, any>[] | undefined;
  const totalPages = Math.ceil((data?.totalItems ?? 1) / itemsPerPage);

  useEffect(() => {
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return (
    <div className="flex flex-col gap-4 text-stone-900 dark:text-stone-100 ">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between px-2">
          <h2 className="text-2xl font-bold">{label}</h2>
          <div className="flex gap-2">
            {!!buttonSection && buttonSection}
            <Button
              size="icon"
              variant="outline"
              className="
                  h-9
                  w-9
                  rounded-full
                border-gray-400
                  p-1 
                  text-gray-700
                  dark:border-stone-600
                  dark:text-stone-400"
              onClick={() => {
                // refetch()
                onRefresh?.();
              }}
            >
              <IconRefresh />
            </Button>
            {showAddButton && (
              <Button
                size="icon"
                variant="outline"
                className="
                    h-9
                    w-9
                    rounded-full                 
                    border-gray-400
                    p-1 
                    text-gray-700
                    dark:border-stone-600
                  dark:text-stone-400
                  "
                onClick={onAddElement}
              >
                <IconPlus />
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-3 px-2.5">
          <div className="flex ">
            <Button
              size="icon"
              variant="outline"
              className="
                  h-9
                  w-9
                  rounded-full
                  border-gray-400
                  p-1 
                  text-gray-700
                  dark:border-stone-600
                  dark:text-stone-400
                  "
              onClick={() => toggleSortOrder()}
            >
              {sortOrder === "asc" ? (
                <IconSortDescending />
              ) : (
                <IconSortAscending />
              )}
            </Button>
          </div>
          <input
            name={"search" + uuid}
            id={"search" + uuid}
            className="
                data-disabled:text-gray-500
                dark:data-disabled:text-gray-500
                data-disabled:bg-transparent 
                dark:data-disabled:bg-transparent
                h-9
                max-h-screen
                w-full
                resize-none
                gap-2 
                overflow-hidden
                whitespace-pre-line 
                break-words
                rounded-full
                border
                border-solid 
                border-gray-400
                bg-white
                px-4
                py-2
                text-sm
                leading-normal 
                outline-none 
                read-only:bg-transparent
                read-only:outline-none
                focus:border-sky-600
                dark:border-stone-600
                dark:bg-stone-800 
                dark:outline-none 
                dark:read-only:bg-transparent 
                dark:read-only:outline-none
                dark:focus:border-sky-600"
            type="text"
            defaultValue={defaultSearch}
            onChange={(value) => setQuery(value.target.value)}
            placeholder={`${t.search}...`}
          />
        </div>
      </div>
      <div className="flex flex-grow flex-col">
        <List<T>
          data={items as T[]}
          ListItem={ListItem}
          onChange={onChange}
          selectedId={selectedId}
          listItemProps={listItemProps}
        />
      </div>
      <Pagination
        totalPages={totalPages}
        initialPage={1}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ApiList;
