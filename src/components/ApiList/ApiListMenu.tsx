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
import { buttonVariants } from "../ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";
import { cn } from "@/utils/cn";
import { type Dispatch, type SetStateAction, useId } from "react";
import type { SortType } from "./types";
import useTranslation from "@/hooks/useTranslation";
import { IsSortForKeyDesc, getFirstArrayElementOrValue } from "./utils";

interface ApiListMenuProps {
  allColumns?: string[];
  sortState?: [
    SortType[] | SortType,
    Dispatch<SetStateAction<SortType[] | SortType>>,
  ];
  visibleColumnsState?: [string[], Dispatch<SetStateAction<string[]>>];
}

function ApiListMenu(props: ApiListMenuProps) {
  const {
    allColumns = [],
    sortState = [{ id: undefined, desc: true } as SortType, undefined],
    visibleColumnsState = [undefined, undefined],
  } = props;
  const [sort, setSort] = sortState;
  const [visibleColumns, setVisibleColumns] = visibleColumnsState;
  const uuid = useId();
  const t = useTranslation();
  return (
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
        {allColumns.map((key, index) => {
          const sortOrder = IsSortForKeyDesc(sort, key);
          return (
            <div
              className="flex gap-2 border-b border-solid last:border-none"
              key={`${uuid}:columnItems:${index}`}
            >
              <DropdownMenuItem
                className="grow justify-end text-right data-[disabled]:opacity-100"
                disabled
              >
                {typeof t[key as keyof typeof t] === "string"
                  ? (t[key as keyof typeof t] as string)
                  : key}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center"
                onClick={() => {
                  setSort?.((prev) => {
                    const p = getFirstArrayElementOrValue(prev) ?? {
                      id: undefined,
                      desc: true,
                    };
                    return {
                      id: key,
                      desc: p.id === key ? !p.desc : true,
                    };
                  });
                }}
              >
                {sortOrder !== undefined ? (
                  sortOrder ? (
                    <IconArrowDown size={14} className="scale-125" />
                  ) : (
                    <IconArrowUp size={14} className="scale-125" />
                  )
                ) : (
                  <IconArrowsSort size={14} className="opacity-10" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center"
                onClick={() => {
                  setVisibleColumns?.((prev) => {
                    if (prev.includes(key)) {
                      return prev.filter((val) => val !== key);
                    }
                    return [...prev, key];
                  });
                }}
              >
                {visibleColumns?.includes(key) ? (
                  <IconEye size={14} className="scale-125" />
                ) : (
                  <IconEyeOff size={14} className="opacity-10" />
                )}
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ApiListMenu;
