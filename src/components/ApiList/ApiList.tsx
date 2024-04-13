import { trpc } from "@/utils/trpc";
import { useDebouncedValue } from "@mantine/hooks";
import { useId, useState, type ReactNode } from "react";
import { ApiListTable, useApiListTableState } from "./ApiListTable";
import useTranslation from "@/hooks/useTranslation";
import Pagination, { usePaginationState } from "../ui/Pagination";
import ItemsPerPageSelect from "./ItemsPerPageSelect";
import * as schema from "@/server/db/schemas";
import { useUserContext } from "@/context/userContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import {
  IconArrowDown,
  IconArrowUp,
  IconArrowsSort,
  IconEye,
  IconEyeClosed,
  IconEyeOff,
  IconSettings,
} from "@tabler/icons-react";
import Button from "../ui/Button";

interface ApiListProps {
  entryName: string;
  label?: string | ReactNode;
  onChange?: (val: number) => void;
  onRefresh?: () => void;
  selectedId?: number | string | null;
  selectedColor?: string;
  filterKeys?: string[];
  sortColumn?: string;
  onAddElement?: () => void;
  defaultSearch?: string;
  showAddButton?: boolean;
  buttonSection?: ReactNode;
  columns: string[];
  columnsExpanded?: string[];
  allColumns?: string[];
  initialSort?: { column?: string; order?: "asc" | "desc" };
}

function ApiList(props: ApiListProps) {
  const {
    entryName,
    label = "",
    onChange,
    onRefresh,
    selectedId,
    selectedColor,
    filterKeys = [],
    onAddElement,
    showAddButton,
    buttonSection,
    columns,
    columnsExpanded = columns,
    allColumns,
    initialSort = { column: "name", order: "desc" },
  } = props;
  const allCols: string[] =
    allColumns ?? schema[`${entryName}s` as keyof typeof schema] !== undefined
      ? Object.keys(schema[`${entryName}s` as keyof typeof schema])
      : [];
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const { page, setPage, itemsPerPage, setItemsPerPage } = usePaginationState();
  const { mobileOpen } = useUserContext();
  const isMobile = useIsMobile();

  const apiListTableState = useApiListTableState({ initialSort });
  const [managedColumns, setManagedColumns] = useState(columns);
  const [managedColumnsExpanded, setManagedColumnsExpanded] =
    useState(columnsExpanded);
  const { sort, setSort } = apiListTableState;

  const { data, refetch } = trpc[entryName as "customer"].simpleSearch.useQuery(
    {
      currentPage: page,
      itemsPerPage,
      keys: filterKeys,
      query: debouncedQuery,
      sort,
    },
  );

  const items = data?.results as Record<string, any>[] | undefined;
  const totalPages = Math.ceil((data?.totalItems ?? 1) / itemsPerPage);

  const uuid = useId();
  const t = useTranslation();

  const currentColumns =
    mobileOpen && !isMobile ? managedColumnsExpanded : managedColumns;

  console.log("cols", managedColumns, managedColumnsExpanded);

  return (
    <div className="flex grow flex-col gap-3">
      <div className="flex gap-2">
        <input
          name={`search${uuid}`}
          id={`search${uuid}`}
          className="h-9 max-h-screen w-full resize-none gap-2 overflow-hidden whitespace-pre-line break-words rounded-md border border-solid bg-background px-4 py-2 text-sm leading-normal outline-none dark:focus:border-sky-600 focus:border-sky-600 dark:data-disabled:bg-transparent dark:read-only:bg-transparent data-disabled:bg-transparent read-only:bg-transparent dark:data-disabled:text-gray-500 data-disabled:text-gray-500 placeholder:text-muted-foreground dark:outline-none dark:read-only:outline-none read-only:outline-none"
          type="text"
          onChange={(value) => setQuery(value.target.value)}
          placeholder={`${t.search}...`}
        />
      </div>
      <div className="relative">
        <ApiListTable
          columns={currentColumns}
          data={items}
          {...apiListTableState}
          selectActionsEnabled={false} // mobileOpen && !isMobile}
          selectedId={selectedId}
          selectedColor={selectedColor}
          onClick={console.log}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-8 w-8 rounded-full"
            >
              <IconSettings size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex gap-2">
              <DropdownMenuLabel className="grow justify-end text-right">
                {t.columns}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="flex items-center">
                <IconArrowsSort size={14} />
              </DropdownMenuLabel>
              <DropdownMenuLabel className="flex items-center">
                <IconEye size={14} />
              </DropdownMenuLabel>
            </div>
            <DropdownMenuSeparator />
            {allCols.map((v, index) => (
              <div className="flex gap-2 border-b border-solid last:border-none">
                <DropdownMenuItem
                  key={`${uuid}:columnNames:${index}`}
                  className="grow justify-end text-right data-[disabled]:opacity-100"
                  disabled
                >
                  {typeof t[v as keyof typeof t] === "string"
                    ? (t[v as keyof typeof t] as string)
                    : v}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center"
                  onClick={() => {
                    setSort((prev) => ({
                      column: v,
                      order:
                        prev.column === v
                          ? prev.order === "asc"
                            ? "desc"
                            : "asc"
                          : "desc",
                    }));
                  }}
                >
                  {sort.column === v ? (
                    sort.order === "asc" ? (
                      <IconArrowUp size={14} className="scale-125" />
                    ) : (
                      <IconArrowDown size={14} className="scale-125" />
                    )
                  ) : (
                    <IconArrowsSort size={14} className="opacity-10" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center"
                  onClick={() => {
                    if (mobileOpen && !isMobile) {
                      setManagedColumnsExpanded((prev) => {
                        if (prev.includes(v)) {
                          return prev.filter((val) => val !== v);
                        }
                        return [...prev, v];
                      });
                    } else {
                      setManagedColumns((prev) => {
                        if (prev.includes(v)) {
                          return prev.filter((val) => val !== v);
                        }
                        return [...prev, v];
                      });
                    }
                  }}
                >
                  {currentColumns.includes(v) ? (
                    <IconEye size={14} className="scale-125" />
                  ) : (
                    <IconEyeOff size={14} className="opacity-10" />
                  )}
                </DropdownMenuItem>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-between">
        <ItemsPerPageSelect
          defaultValue={itemsPerPage}
          onChange={setItemsPerPage}
        />
        <Pagination
          totalPages={totalPages}
          initialPage={1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default ApiList;
