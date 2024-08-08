import Button from "@/components/ui/Button";
import type { OrderWithoutRelations } from "@/server/api/order/validator";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/cn";

import {
  IconCalendarMonth,
  IconCalendarWeek,
  IconUser,
  IconCrown,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useState } from "react";
import CalendarMonth from "./calendar/CalendarMonth";
import CalendarWeek from "./calendar/CalendarWeek";
import { useFlag } from "@/hooks/useFlag";

// TODO: fix corners in month table
function CalendarView() {
  const { flags } = useFlag("calendar");

  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [mode, setMode] = useState<"month" | "week">(
    flags?.default_view_mode ?? "month",
  );
  const [dataMode, setDataMode] = useState<"user" | "all">(
    flags?.default_data_source ?? "user",
  );

  const { data } = trpc.order.getByCompletionDateRange.useQuery({
    rangeStart: currentMonth.startOf("month").format("YYYY-MM-DD HH:mm:ss"),
    rangeEnd: currentMonth
      .add(1, "month")
      .startOf("month")
      .format("YYYY-MM-DD HH:mm:ss"),
    currentUserOnly: dataMode === "user",
  });

  const ordersByDay =
    data?.reduce(
      (
        arr: Array<Array<OrderWithoutRelations>>,
        val: OrderWithoutRelations,
      ) => {
        if (val.dateOfCompletion === null) return arr;
        const index = Number.parseInt(dayjs(val.dateOfCompletion).format("DD"));
        if (arr[index] === undefined) {
          arr[index] = [val];
        } else {
          arr[index]?.push(val);
        }

        return arr;
      },
      [] as Array<Array<OrderWithoutRelations>>,
    ) ?? [];

  return (
    <div className="flex flex-grow flex-col gap-2">
      <div className="flex gap-3">
        <div className="flex gap-0">
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "rounded-r-none",
              mode === "month" && "bg-sky-700/25",
            )}
            onClick={() => {
              setMode("month");
            }}
          >
            <IconCalendarMonth />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "rounded-l-none border-l-none",
              mode === "week" && "bg-sky-700/25",
            )}
            onClick={() => {
              setMode("week");
            }}
          >
            <IconCalendarWeek />
          </Button>
        </div>
        <div className="flex gap-0">
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "rounded-r-none",
              dataMode === "user" && "bg-sky-700/25",
            )}
            onClick={() => {
              setDataMode("user");
            }}
          >
            <IconUser />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "rounded-l-none border-l-none",
              dataMode === "all" && "bg-sky-700/25",
            )}
            onClick={() => {
              setDataMode("all");
            }}
          >
            <IconCrown />
          </Button>
        </div>
      </div>
      {mode === "month" && (
        <CalendarMonth
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          orders={ordersByDay}
        />
      )}
      {mode === "week" && (
        <CalendarWeek
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          orders={ordersByDay}
        />
      )}
    </div>
  );
}

export default CalendarView;
