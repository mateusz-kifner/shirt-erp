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
  IconEyeOff,
  IconSettings,
} from "@tabler/icons-react";
import Button, { buttonVariants } from "../ui/Button";
import { cn } from "@/utils/cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";
import PullToRefresh from "../PullToRefetch";
import styles from "../layout/Navigation/navigation.module.css";
import { useIsInsideNavigation } from "../layout/Navigation/isInsideNavigationContext";

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
  leftSection?: ReactNode;
  rightSection?: ReactNode;
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
    leftSection,
    rightSection,
    columns,
    columnsExpanded = columns,
    allColumns,
    initialSort = { column: "updatedById", order: "desc" },
  } = props;
  const allCols: string[] =
    allColumns ?? schema[`${entryName}s` as keyof typeof schema] !== undefined
      ? Object.keys(schema[`${entryName}s` as keyof typeof schema])
      : [];
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const { page, setPage, itemsPerPage, setItemsPerPage } = usePaginationState();
  const { mobileOpen, setMobileOpen } = useUserContext();
  const isMobile = useIsMobile();
  const isInsideNavigation = !!useIsInsideNavigation();

  const apiListTableState = useApiListTableState({ initialSort });
  const [managedColumns, setManagedColumns] = useState(columns);
  const [managedColumnsExpanded, setManagedColumnsExpanded] =
    useState(columnsExpanded);
  const { sort, setSort } = apiListTableState;
  const [mainNavigationOpen, setMainNavigationOpen] = useState(false);

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
                isInsideNavigation ? styles.label : undefined,
                isInsideNavigation
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
              columns={currentColumns}
              columnsExpanded={managedColumnsExpanded}
              data={items}
              {...apiListTableState}
              selectActionsEnabled={false} // mobileOpen && !isMobile}
              selectedId={selectedId}
              selectedColor={selectedColor}
              onClick={(val: number) => {
                isMobile && setMobileOpen(false);
                onChange?.(val);
              }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "absolute top-1 right-1 h-8 w-8 rounded-full",
                )}
              >
                <IconSettings size={18} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex gap-2">
                  <DropdownMenuLabel className="grow justify-end text-right">
                    {t.columns}
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="flex items-center">
                    <Tooltip>
                      <TooltipTrigger>
                        <IconArrowsSort size={14} />
                      </TooltipTrigger>
                      <TooltipContent>{t.sort}</TooltipContent>
                    </Tooltip>
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="flex items-center">
                    <Tooltip>
                      <TooltipTrigger>
                        <IconEye size={14} />
                      </TooltipTrigger>
                      <TooltipContent>{t.visibility}</TooltipContent>
                    </Tooltip>
                  </DropdownMenuLabel>
                </div>
                <DropdownMenuSeparator />
                {allCols.map((v, index) => (
                  <div
                    className="flex gap-2 border-b border-solid last:border-none"
                    key={`${uuid}:columnItems:${index}`}
                  >
                    <DropdownMenuItem
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
        </div>
        <div
          className={cn(
            isInsideNavigation ? styles.label : undefined,
            isInsideNavigation
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
