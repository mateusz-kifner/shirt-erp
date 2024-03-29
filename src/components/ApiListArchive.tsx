/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useId, useState, type ReactNode } from "react";

import { useDebouncedValue, useToggle } from "@mantine/hooks";
import {
  IconArchive,
  IconArchiveOff,
  IconPlus,
  IconRefresh,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";

import List from "@/components/List";
import Pagination from "@/components/ui/Pagination";
import useTranslation from "@/hooks/useTranslation";
import { trpc } from "@/utils/trpc";
import Button from "./ui/Button";
import { cn } from "@/utils/cn";

interface ApiListArchiveProps<T = any> {
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

const ApiListArchive = <T extends { id: number | string }>(
  props: ApiListArchiveProps<T>,
) => {
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
  const [isArchived, setIsArchived] = useState(false);
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [page, setPage] = useState<number>(1);
  const { data, refetch } = trpc[entryName as "order"].search.useQuery({
    sort: sortOrder,
    keys: filterKeys,
    query: debouncedQuery,
    excludeKey,
    excludeValue,
    currentPage: page,
    sortColumn,
    itemsPerPage,
    isArchived,
  });

  const items = data?.results as Record<string, any>[] | undefined;
  const totalPages = Math.ceil((data?.totalItems ?? 1) / itemsPerPage);

  useEffect(() => {
    void refetch();
  }, [selectedId]);

  return (
    <div className="flex flex-col gap-4 text-stone-900 dark:text-stone-100">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between px-2">
          <h2 className="font-bold text-2xl">{label}</h2>
          <div className="flex gap-2">
            {!!buttonSection && buttonSection}
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 rounded-full p-1"
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
                className="h-9 w-9 rounded-full p-1"
                onClick={onAddElement}
              >
                <IconPlus />
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-3 px-2.5">
          <Button
            size="icon"
            variant="outline"
            className="h-9 w-9 rounded-full p-1"
            onClick={() => toggleSortOrder()}
          >
            {sortOrder === "asc" ? (
              <IconSortDescending />
            ) : (
              <IconSortAscending />
            )}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "h-9 w-9 rounded-full p-1",
              isArchived && "bg-orange-700 hover:bg-orange-700/80",
            )}
            onClick={() => {
              setIsArchived((v) => !v);
            }}
          >
            {isArchived ? <IconArchive /> : <IconArchiveOff />}
          </Button>

          <input
            name={`search${uuid}`}
            id={`search${uuid}`}
            className="h-9 max-h-screen w-full resize-none gap-2 overflow-hidden whitespace-pre-line break-words rounded-full border border-solid bg-background px-4 py-2 text-sm leading-normal outline-none dark:focus:border-sky-600 focus:border-sky-600 dark:data-disabled:bg-transparent dark:read-only:bg-transparent data-disabled:bg-transparent read-only:bg-transparent dark:data-disabled:text-gray-500 data-disabled:text-gray-500 placeholder:text-muted-foreground dark:outline-none dark:read-only:outline-none read-only:outline-none"
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

export default ApiListArchive;
