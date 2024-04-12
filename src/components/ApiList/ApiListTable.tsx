import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useId,
  useState,
  type ReactNode,
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
import HeaderButton from "./TableHeader";
import { Checkbox } from "../ui/Checkbox";
import { Skeleton } from "../ui/Skeleton";
import dayjs from "dayjs";
import { addressToString } from "@/server/api/address/utils";

function valueAsString(value: any): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return `${value}`;
  if (typeof value === "boolean") return value ? "Tak" : "Nie";

  if (value instanceof Date) return dayjs(value).format("LT L").toString();
  if (Array.isArray(value)) {
    return value.reduce(
      (prev, val) => `${prev}${valueAsString(val)}\n`,
      "",
    ) as string;
  }
  if (typeof value === "object") {
    if (
      value?.streetName !== undefined ||
      value?.streetNumber !== undefined ||
      value?.apartmentNumber !== undefined ||
      value?.secondLine !== undefined ||
      value?.postCode !== undefined ||
      value?.city !== undefined ||
      value?.province !== undefined
    )
      return addressToString(value) ?? "";
  }
  console.log(value);
  return `[ ApiListTable ]: value cannot be converted to string is typeof ${typeof value}`;
}

interface ApiListTableProps<TData, TValue> {
  columns: string[];
  data?: Record<string, any>[];
  checked: number[];
  setChecked: Dispatch<SetStateAction<number[]>>;
  sort: {
    column?: string | undefined;
    order?: "asc" | "desc" | undefined;
  };
  setSort: Dispatch<
    SetStateAction<{ column?: string; order?: "asc" | "desc" }>
  >;
  itemsPerPage?: number;
  selectActionsEnabled?: boolean;
  selectedId?: number | string | null;
  selectedColor?: string;
  onClick?: (id: number) => void;
}

function ApiListTable<TData, TValue>(props: ApiListTableProps<TData, TValue>) {
  const {
    columns,
    data = [],
    itemsPerPage = 10,
    checked,
    setChecked,
    sort,
    setSort,
    selectActionsEnabled = false,
    selectedId,
    selectedColor = "#0C859933",
    onClick,
  } = props;

  const uuid = useId();
  const currentIds = data.map((v) => v.id) as number[];
  const all_checked = _.isEqual(currentIds.sort(), checked.sort());
  const some_checked = !_.isEmpty(_.intersection(currentIds, checked));

  const empty: null[] = new Array(itemsPerPage).fill(null);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {selectActionsEnabled && (
              <TableHead
                key={`table${uuid}header:checkbox`}
                className="flex items-center px-8 text-left"
              >
                <Checkbox
                  checked={
                    all_checked || (some_checked ? "indeterminate" : false)
                  }
                  onCheckedChange={(value) => {
                    if (value === true) {
                      setChecked(currentIds);
                    } else {
                      setChecked((prev) =>
                        prev.filter((v) => !currentIds.includes(v)),
                      );
                    }
                  }}
                  className="border-muted-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                  aria-label="Select all"
                />
              </TableHead>
            )}
            {columns.map((val, index) => (
              <TableHead key={`table${uuid}header:${index}`}>
                <HeaderButton
                  className="w-full justify-start px-4 text-left"
                  sortOrder={
                    val === sort.column ? sort.order ?? "desc" : undefined
                  }
                  onClick={() =>
                    setSort((prev) => ({
                      column: val,
                      order:
                        prev.column === val
                          ? prev.order === "asc"
                            ? "desc"
                            : "asc"
                          : "desc",
                    }))
                  }
                >
                  {val}
                </HeaderButton>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0
            ? data.map((row, indexRow) => (
                <TableRow
                  key={`table${uuid}row:${indexRow}`}
                  onClick={() => onClick?.(row.id)}
                  style={{
                    backgroundColor:
                      selectedId === row.id ? selectedColor : undefined,
                  }}
                >
                  {selectActionsEnabled && (
                    <TableCell
                      className="flex h-full grow items-center justify-center px-8 text-left"
                      key={`table${uuid}row:${indexRow}:cell:checkbox`}
                    >
                      <Checkbox
                        checked={checked.includes(row.id as number)}
                        onCheckedChange={(value) => {
                          if (value === true) {
                            setChecked((prev) => [...prev, row.id as number]);
                          } else {
                            setChecked((prev) =>
                              prev.filter((v) => v !== row.id),
                            );
                          }
                        }}
                        aria-label="Select"
                        className="border-muted-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                      />
                    </TableCell>
                  )}
                  {columns.map((key, indexCell) => (
                    <TableCell
                      className="h-14 min-w-44 px-8 text-left"
                      key={`table${uuid}row:${indexRow}:cell:${indexCell}`}
                    >
                      {valueAsString(row[key])}
                    </TableCell>
                  ))}
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

interface useApiListTableStateProps {
  initialChecked?: number[];
  initialSort?: { column?: string; order?: "asc" | "desc" };
}

function useApiListTableState(props: useApiListTableStateProps = {}) {
  const [checked, setChecked] = useState<number[]>(props.initialChecked ?? []);
  const [sort, setSort] = useState<{ column?: string; order?: "asc" | "desc" }>(
    {
      column: props.initialSort?.column,
      order: props.initialSort?.order ?? "desc",
    },
  );
  return {
    checked,
    setChecked,
    sort,
    setSort,
  };
}

export { ApiListTable, useApiListTableState };
