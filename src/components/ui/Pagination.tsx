import { useId, useState } from "react";

import { usePagination } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDots,
} from "@tabler/icons-react";
import { cn } from "@/utils/cn";
import Button from "./Button";

interface PaginationProps {
  siblings?: number;
  initialPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  siblings = 2,
  initialPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const uuid = useId();
  const { range, active, setPage } = usePagination({
    total: totalPages,
    initialPage,
    onChange: onPageChange,
    siblings,
  });

  return (
    <nav className="flex items-center justify-center gap-px">
      <button
        type="button"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md",
          active === 1
            ? "text-stone-500"
            : "text-blue-600 hover:bg-black hover:bg-opacity-30 hover:text-blue-600",
        )}
        onClick={() => setPage(active - 1)}
        disabled={active === 1}
      >
        <IconChevronLeft />
        <span className="sr-only">Previous</span>
      </button>

      {range.map((page, index) => {
        if (page === "dots") {
          return (
            <IconDots
              key={`${uuid}_${index}`}
              className="text-stone-500 dark:text-stone-200"
              size={16}
            />
          );
        }

        return (
          <button
            type="button"
            key={`${uuid}_${index}`}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-md font-medium text-base",
              active === page
                ? "bg-blue-500/50 text-white"
                : "text-stone-600 hover:bg-black hover:bg-opacity-30 dark:text-stone-300 hover:text-blue-600",
            )}
            onClick={() => setPage(page)}
            aria-current={active === page ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md",
          active === totalPages
            ? "text-stone-500"
            : "text-blue-600 hover:bg-black hover:bg-opacity-30 hover:text-blue-600",
        )}
        onClick={() => setPage(active + 1)}
        disabled={active === totalPages}
      >
        <span className="sr-only">Next</span>
        <IconChevronRight />
      </button>
    </nav>
  );
}
interface usePaginationDataProps {
  page: number;
  itemsPerPage: number;
}

function usePaginationState(initialState?: usePaginationDataProps) {
  const [page, setPage] = useState<number>(initialState?.page ?? 1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    initialState?.itemsPerPage ?? 10,
  );
  return { page, setPage, itemsPerPage, setItemsPerPage };
}

export default Pagination;
export { usePaginationState };
