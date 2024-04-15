import { trpc } from "@/utils/trpc";
import { useDebouncedValue } from "@mantine/hooks";
import {
  type ComponentType,
  useId,
  useState,
  type ReactNode,
  useMemo,
} from "react";
import ApiListTable, { type ApiListTableProps } from "./ApiListTable";
import useTranslation from "@/hooks/useTranslation";
import Pagination, { usePaginationState } from "../ui/Pagination";
import ItemsPerPageSelect from "./ItemsPerPageSelect";
import * as schema from "@/server/db/schemas";
import { useUserContext } from "@/context/userContext";
import { useIsMobile } from "@/hooks/useIsMobile";

import { cn } from "@/utils/cn";
import PullToRefresh from "../PullToRefetch";
import styles from "../layout/Navigation/navigation.module.css";
import { useIsInsideNavigation } from "../layout/Navigation/isInsideNavigationContext";
import ApiListMenu from "./ApiListMenu";
import type { SortType } from "./types";

interface ApiListProps<TData> extends ApiListTableProps<TData> {
  entryName: string;
  onChange?: (val: number) => void;
  onRefresh?: () => void;
  selectedId?: number | string | null;
  selectedColor?: string;
  filterKeys?: string[];
  defaultSearch?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  columns: string[];
  columnsExpanded?: string[];
  allColumns?: string[];
  initialSort?: SortType[] | SortType;
  dataTransformer?: <T extends Record<string, any> | undefined>(
    columns: string[],
    data: T,
  ) => { columns: string[]; data: T };
  generated?: <T extends Record<string, any>>(
    columns: string[],
    data: T | undefined,
  ) => { columnName: string; columnData: T; insertIndex: number }[];
  customSortActions?: Record<string, (desc: boolean) => SortType[] | SortType>;
}

function ApiList<TData extends Record<string, any>[]>(
  props: ApiListProps<TData>,
) {
  const {
    entryName,
    onChange,
    onRefresh,
    selectedId,
    selectedColor,
    filterKeys = [],
    leftSection,
    rightSection,
    columns,
    columnsExpanded = columns,
    allColumns,
    initialSort = { id: "updatedAt", desc: true },
    BeforeCell,
    AfterCell,
    generated,
    customSortActions,
  } = props;
  const allCols: string[] =
    allColumns ?? schema[`${entryName}s` as keyof typeof schema] !== undefined
      ? Object.keys(schema[`${entryName}s` as keyof typeof schema])
      : []; // If this fails provide allColumns manually
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const { page, setPage, itemsPerPage, setItemsPerPage } = usePaginationState();
  const { mobileOpen, setMobileOpen } = useUserContext();
  const isMobile = useIsMobile();
  const isInsideNavigation = !!useIsInsideNavigation();

  const sortState = useState<SortType[] | SortType>(initialSort);
  // const checkedState = useState<number[]>(props.initialChecked ?? []);
  const [managedColumns, setManagedColumns] = useState(columns);
  const [managedColumnsExpanded, setManagedColumnsExpanded] =
    useState(columnsExpanded);
  const [sort, setSort] = sortState;
  const [mainNavigationOpen] = useState(false);

  const { data, refetch } = trpc[entryName as "customer"].simpleSearch.useQuery(
    {
      currentPage: page,
      itemsPerPage,
      keys: filterKeys,
      query: debouncedQuery,
      sort,
    },
  );

  const items = data?.results as TData | undefined;
  const totalPages = Math.ceil((data?.totalItems ?? 1) / itemsPerPage);

  const uuid = useId();
  const t = useTranslation();

  const currentColumns =
    mobileOpen && !isMobile ? managedColumnsExpanded : managedColumns;

  const generatedData = useMemo(
    () => generated?.(currentColumns, items) ?? [],
    [generated, currentColumns, items],
  );

  const modifiedData = useMemo(
    () =>
      (items ?? []).map((v, index) => {
        const row = { ...v };
        for (const gen of generatedData) {
          (row as any)[gen.columnName] = gen.columnData[index];
        }
        return row;
      }),
    [generatedData, items],
  );

  return (
    <PullToRefresh onEnd={() => void refetch()}>
      <div className="flex grow flex-col gap-3">
        <div className={cn("flex flex-col gap-3", !isMobile && "grow")}>
          <div className="flex gap-2">
            {!!leftSection && leftSection}
            <input
              name={`search${uuid}`}
              id={`search${uuid}`}
              className={cn(
                isInsideNavigation && !mobileOpen ? styles.label : undefined,
                isInsideNavigation && !mobileOpen
                  ? isMobile || mainNavigationOpen
                    ? "opacity-100"
                    : "fade-out animate-out fill-mode-both"
                  : undefined,
                "h-9 max-h-screen w-full resize-none gap-2 overflow-hidden whitespace-pre-line break-words rounded-md border border-solid bg-background px-4 py-2 text-sm leading-normal outline-none dark:focus:border-sky-600 focus:border-sky-600 dark:data-disabled:bg-transparent dark:read-only:bg-transparent data-disabled:bg-transparent read-only:bg-transparent dark:data-disabled:text-gray-500 data-disabled:text-gray-500 placeholder:text-muted-foreground dark:outline-none dark:read-only:outline-none read-only:outline-none",
              )}
              type="text"
              onChange={(value) => setQuery(value.target.value)}
              placeholder={`${t.search}...`}
            />
            {!!rightSection && rightSection}
          </div>
          <div className="relative">
            <div className="absolute inset-0 z-[-1] rounded-md bg-white/20 dark:bg-black/20" />
            <ApiListTable
              columns={columns}
              data={modifiedData}
              {...sortState}
              //selectActionsEnabled={false} // mobileOpen && !isMobile}
              selectedId={selectedId}
              selectedColor={selectedColor}
              onClick={(val: number) => {
                isMobile && setMobileOpen(false);
                onChange?.(val);
              }}
              BeforeCell={BeforeCell}
              AfterCell={AfterCell}
            />
            <ApiListMenu
              allColumns={allCols}
              sortState={sortState}
              visibleColumnsState={[
                currentColumns,
                mobileOpen && !isMobile
                  ? setManagedColumnsExpanded
                  : setManagedColumns,
              ]}
            />
          </div>
        </div>
        <div
          className={cn(
            isInsideNavigation && !mobileOpen ? styles.label : undefined,
            isInsideNavigation && !mobileOpen
              ? isMobile || mainNavigationOpen
                ? "opacity-100"
                : "fade-out animate-out fill-mode-both"
              : undefined,
            "flex justify-between",
          )}
        >
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
    </PullToRefresh>
  );
}

export default ApiList;
