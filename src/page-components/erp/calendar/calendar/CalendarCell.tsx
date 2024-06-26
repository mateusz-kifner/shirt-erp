import { useFlag } from "@/hooks/useFlag";
import type { OrderWithoutRelations } from "@/server/api/order/validator";
import { cn } from "@/utils/cn";
import {
  getRandomColorByNumber,
  getRandomColorByString,
} from "@/utils/getRandomColor";
import { useRouter } from "next/router";
import { useId } from "react";

interface CalendarCellProps {
  day: number;
  dayOrders?: Array<OrderWithoutRelations>;
  highlight?: boolean;
}

function CalendarCell(props: CalendarCellProps) {
  const { day, dayOrders, highlight } = props;

  const uuid = useId();
  const router = useRouter();

  const { flags } = useFlag("calendar");

  return (
    <div
      className={cn(
        "flex h-full flex-grow flex-col gap-0.5",
        highlight && "bg-sky-700/25 ring-1 ring-sky-700/50 ring-offset-0",
      )}
    >
      <div className="px-1 py-0.5">{day}</div>
      <div>
        {dayOrders?.map((val, indexOrderByDay) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: TODO: make this usable with keyboard
          <div
            key={`${uuid}${indexOrderByDay}:`}
            style={{
              backgroundColor:
                typeof val.id === "number"
                  ? `${getRandomColorByNumber(val.id)}aa`
                  : `${getRandomColorByString(val.id)}aa`,
            }}
            className="cursor-pointer px-1 py-0.5"
            onClick={() => {
              void router.push(
                `/erp/${flags?.default_click ?? "order"}/${val.id}`,
              );
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              void router.push(
                `/erp/${
                  (flags?.default_click ?? "task") === "order"
                    ? "task"
                    : "order"
                }/${val.id}`,
              );
            }}
          >
            {val.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarCell;
