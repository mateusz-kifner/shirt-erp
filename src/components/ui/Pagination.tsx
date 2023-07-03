import { useId } from "react";

import { usePagination } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDots,
} from "@tabler/icons-react";

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
        className={`inline-flex  h-9 w-9 items-center justify-center rounded-full ${
          active === 1
            ? "text-stone-500"
            : "text-blue-600 hover:bg-black hover:bg-opacity-20 hover:text-blue-600"
        }`}
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
            key={`${uuid}_${index}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-base font-medium  ${
              active === page
                ? "bg-blue-500 text-white"
                : "text-stone-600 hover:bg-black hover:bg-opacity-20 hover:text-blue-600 dark:text-stone-300"
            }`}
            onClick={() => setPage(page)}
            aria-current={active === page ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        className={`inline-flex  h-9 w-9 items-center justify-center rounded-full  ${
          active === totalPages
            ? "text-stone-500"
            : "text-blue-600 hover:bg-black hover:bg-opacity-20 hover:text-blue-600"
        }`}
        onClick={() => setPage(active + 1)}
        disabled={active === totalPages}
      >
        <span className="sr-only">Next</span>
        <IconChevronRight />
      </button>
    </nav>
  );
}

export default Pagination;
