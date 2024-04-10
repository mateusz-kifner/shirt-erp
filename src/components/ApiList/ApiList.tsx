import { trpc } from "@/utils/trpc";
import { useDebouncedValue } from "@mantine/hooks";
import { useId, useReducer, useState, type ReactNode } from "react";
import { DataTable } from "./TableTest";
import useApiSearchQueryOptions from "./useApiSearchQueryOptions";
import type { Column, ColumnDef, SortingState } from "@tanstack/react-table";
import * as schema from "@/server/db/schemas";
import Button from "../ui/Button";
import type { Customer } from "@/server/api/customer/validator";
import {
  IconArrowsUpDown,
  IconArrowNarrowUp,
  IconArrowNarrowDown,
} from "@tabler/icons-react";
import useTranslation from "@/hooks/useTranslation";

interface ApiListProps<T = any> {
  entryName: string;
  label?: string | ReactNode;
  onChange?: (val: T) => void;
  onRefresh?: () => void;
  selectedId?: number | string | null;
  filterKeys?: string[];
  sortColumn?: string;
  onAddElement?: () => void;
  defaultSearch?: string;
  showAddButton?: boolean;
  buttonSection?: ReactNode;
  columnDef: { label: string; accessorKey: string }[];
  defaultColumn?: string;
}

function ApiList<T extends { id: number | string }>(props: ApiListProps) {
  const {
    entryName,
    label = "",
    onChange,
    onRefresh,
    selectedId,
    filterKeys = [],
    onAddElement,
    showAddButton,
    buttonSection,
    columnDef,
    defaultColumn = "name",
  } = props;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [queryOptions, dispatchQueryOptions] = useApiSearchQueryOptions({
    keys: ["name"],
    currentPage: 1,
  });
  const { data, refetch } = trpc[entryName as "customer"].simpleSearch.useQuery(
    {
      ...queryOptions,
      query: debouncedQuery,
      sort:
        sorting.length > 0
          ? { column: sorting[0]?.id, order: sorting[0]?.desc ? "desc" : "asc" }
          : undefined,
    },
  );

  const items = data?.results as Record<string, any>[] | undefined;

  const columns = columnDef.map((val) => ({
    accessorKey: val.accessorKey,
    header: ({ column }: { column: Column<any, any> }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="gap-0"
        >
          {val.label}
          {column.getIsSorted() !== false ? (
            column.getIsSorted() === "asc" ? (
              <IconArrowNarrowUp className="h-5 w-5" />
            ) : (
              <IconArrowNarrowDown className="h-5 w-5" />
            )
          ) : (
            <div className="h-5 w-5" />
          )}
        </Button>
      );
    },
  }));

  const uuid = useId();
  const t = useTranslation();

  return (
    <>
      <input
        name={`search${uuid}`}
        id={`search${uuid}`}
        className="h-9 max-h-screen w-full resize-none gap-2 overflow-hidden whitespace-pre-line break-words rounded-full border border-solid bg-background px-4 py-2 text-sm leading-normal outline-none dark:focus:border-sky-600 focus:border-sky-600 dark:data-disabled:bg-transparent dark:read-only:bg-transparent data-disabled:bg-transparent read-only:bg-transparent dark:data-disabled:text-gray-500 data-disabled:text-gray-500 placeholder:text-muted-foreground dark:outline-none dark:read-only:outline-none read-only:outline-none"
        type="text"
        onChange={(value) => setQuery(value.target.value)}
        placeholder={`${t.search}...`}
      />
      {items !== undefined ? (
        <DataTable
          data={items as any[]}
          columns={columns}
          sorting={sorting}
          setSorting={setSorting}
        />
      ) : (
        <>brak danych</>
      )}
    </>
  );
}

export default ApiList;
