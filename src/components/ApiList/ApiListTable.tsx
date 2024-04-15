import {
  type Dispatch,
  type SetStateAction,
  useId,
  type ComponentType,
} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";
import _ from "lodash";
import { Checkbox } from "../ui/Checkbox";
import { Skeleton } from "../ui/Skeleton";
import dayjs from "dayjs";
import { IconArrowNarrowDown, IconArrowNarrowUp } from "@tabler/icons-react";
import { cn } from "@/utils/cn";
import { buttonVariants } from "../ui/Button";
import type { SortType } from "./types";
import { IsSortForKeyDesc, getFirstArrayElementOrValue } from "./utils";

export interface ApiListTableProps<TData> {
  columns: string[];
  data?: TData;
  checkedState?: [number[], Dispatch<SetStateAction<number[]>>];
  sortState?: [
    SortType[] | SortType,
    Dispatch<SetStateAction<SortType[] | SortType>>,
  ];
  itemsPerPage?: number;
  selectedId?: number | string | null;
  selectedColor?: string;
  onClick?: (id: number) => void;
  BeforeCell?: ComponentType<{ data: Record<string, any> }>;
  AfterCell?: ComponentType<{ data: Record<string, any> }>;
}

function ApiListTable<TData extends Record<string, any>[]>(
  props: ApiListTableProps<TData>,
) {
  const {
    columns,
    data = [],
    itemsPerPage = 10,
    checkedState = [[] as number[], undefined],
    sortState = [{ id: "updatedAt", desc: true } as SortType, undefined],
    selectedId,
    selectedColor = "#0C859933",
    onClick,
    BeforeCell,
    AfterCell,
  } = props;
  const [sort, setSort] = sortState;
  const [checked, setChecked] = checkedState;
  const checkEnabled = checkedState[1] !== undefined;

  const uuid = useId();
  const currentIds = data.map((v) => v.id) as number[];
  const all_checked = _.isEqual(currentIds.sort(), checked.sort());
  const some_checked = !_.isEmpty(_.intersection(currentIds, checked));

  const empty: null[] = new Array(itemsPerPage).fill(null);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="dark:hover:bg-transparent hover:bg-transparent">
            {!!BeforeCell && <TableHead className="h-10 w-0 px-2 py-0.5" />}
            {checkEnabled && (
              <TableHead
                key={`table${uuid}header:checkbox`}
                className="relative w-14"
              >
                <Checkbox
                  checked={
                    all_checked || (some_checked ? "indeterminate" : false)
                  }
                  onCheckedChange={(value) => {
                    if (value === true) {
                      (setChecked as Dispatch<SetStateAction<number[]>>)(
                        currentIds,
                      );
                    } else {
                      (setChecked as Dispatch<SetStateAction<number[]>>)(
                        (prev) => prev.filter((v) => !currentIds.includes(v)),
                      );
                    }
                  }}
                  className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 border-muted-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                  aria-label="Select all"
                />
              </TableHead>
            )}
            {columns.map((key, index) => {
              const sortOrder = IsSortForKeyDesc(sort, key);
              return (
                <TableHead
                  key={`table${uuid}header:${index}`}
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      className: "rounded-none",
                    }),
                    key === "id" ? "w-14" : "",
                    "table-cell h-10 text-left first:rounded-tl-md last:rounded-tr-md dark:hover:bg-muted/50 hover:bg-muted-foreground/50",
                  )}
                  onClick={() =>
                    setSort?.((prev) => {
                      const p = getFirstArrayElementOrValue(prev) ?? {
                        id: undefined,
                        desc: true,
                      };
                      return {
                        id: key,
                        desc: p.id === key ? !p.desc : true,
                      };
                    })
                  }
                >
                  <div className="flex items-center justify-start">
                    {key}
                    {sortOrder !== undefined ? (
                      sortOrder ? (
                        <IconArrowNarrowDown className="h-5 w-5" />
                      ) : (
                        <IconArrowNarrowUp className="h-5 w-5" />
                      )
                    ) : (
                      <div className="h-5 w-5" />
                    )}
                  </div>
                </TableHead>
              );
            })}
            {!!AfterCell && <TableHead className="w-0 px-2 py-0.5" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0
            ? data.map((row, indexRow) => (
                <TableRow
                  key={`table${uuid}row:${indexRow}`}
                  onClick={() => onClick?.(row.id)}
                  style={{
                    background:
                      selectedId === row.id ? selectedColor : undefined,
                  }}
                >
                  {!!BeforeCell && (
                    <TableHead className="w-0 px-2 py-0.5">
                      <BeforeCell data={row} />
                    </TableHead>
                  )}
                  {checkEnabled && (
                    <TableCell
                      className="relative h-full w-14 text-left"
                      key={`table${uuid}row:${indexRow}:cell:checkbox`}
                    >
                      <Checkbox
                        checked={checked.includes(row.id as number)}
                        onCheckedChange={(value) => {
                          if (value === true) {
                            (setChecked as Dispatch<SetStateAction<number[]>>)(
                              (prev) => [...prev, row.id as number],
                            );
                          } else {
                            (setChecked as Dispatch<SetStateAction<number[]>>)(
                              (prev) => prev.filter((v) => v !== row.id),
                            );
                          }
                        }}
                        aria-label="Select"
                        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 border-muted-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                      />
                    </TableCell>
                  )}
                  {columns.map((key, indexCell) => (
                    <TableCell
                      className={cn(
                        key === "id" ? "w-14" : "min-w-44",
                        "h-14 text-left",
                      )}
                      key={`table${uuid}row:${indexRow}:cell:${indexCell}`}
                    >
                      {row[key]}
                    </TableCell>
                  ))}
                  {!!AfterCell && (
                    <TableHead className="w-0 px-2 py-0.5">
                      <AfterCell data={row} />
                    </TableHead>
                  )}
                </TableRow>
              ))
            : empty.map((_, indexRow) => (
                <TableRow key={`table${uuid}row:${indexRow}:empty`}>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-14 text-center"
                  >
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ApiListTable;
