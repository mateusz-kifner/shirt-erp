import Button from "@/components/ui/Button";
import useTranslation from "@/hooks/useTranslation";
import { OrderWithoutRelations } from "@/schema/orderZodSchema";
import { api } from "@/utils/api";
import {
  getRandomColorByNumber,
  getRandomColorByString,
} from "@/utils/getRandomColor";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import dayjs, { WeekdayNames } from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useId, useState } from "react";

interface CalendarViewProps {}

function CalendarView(props: CalendarViewProps) {
  const {} = props;
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [localeData, setLocaleData] = useState(dayjs.localeData());
  const uuid = useId();
  const t = useTranslation();
  const router = useRouter();

  const { data } = api.order.getByCompletionDateRange.useQuery({
    rangeStart: currentMonth.startOf("month").format("YYYY-MM-DD HH:mm:ss"),
    rangeEnd: currentMonth
      .add(1, "month")
      .startOf("month")
      .format("YYYY-MM-DD HH:mm:ss"),
  });

  const ordersByDay =
    data?.reduce(
      (
        arr: Array<Array<OrderWithoutRelations>>,
        val: OrderWithoutRelations,
      ) => {
        if (val.dateOfCompletion === null) return arr;
        const index = parseInt(dayjs(val.dateOfCompletion).format("DD"));
        console.log(index, val.dateOfCompletion);
        if (arr[index] === undefined) {
          arr[index] = [val];
        } else {
          arr[index]?.push(val);
        }

        return arr;
      },
      [] as Array<Array<OrderWithoutRelations>>,
    ) ?? [];

  useEffect(() => {
    // Fetch and set locale data dynamically
    const newLocaleData = dayjs().localeData();
    setLocaleData(newLocaleData);
  }, [currentMonth]);

  const firstDayOfWeek = localeData.firstDayOfWeek();
  let weekdays = localeData.weekdaysShort();

  // realign weekdays
  if (firstDayOfWeek !== 0) {
    weekdays = weekdays.map(
      (_, index, arr) => arr[(index + firstDayOfWeek) % weekdays.length],
    ) as WeekdayNames;
  }

  const daysInMonth = currentMonth.daysInMonth();
  let firstDayOfMonth = currentMonth.startOf("month").day() - firstDayOfWeek; // Adjust for Monday as the first day of the week
  firstDayOfMonth = firstDayOfMonth < 0 ? 6 : firstDayOfMonth; // Ensure the result is within [0, 6]
  const weeks: (number | null)[][] = [];

  let currentWeek = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    for (let i = currentWeek.length; i < 7; i++) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const changeMonth = (amount: number) => {
    setCurrentMonth((prevMonth) => prevMonth.add(amount, "month"));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2 className="flex-grow">{dayjs(currentMonth).format("MMMM YYYY")}</h2>
        <Button
          onClick={() => {
            changeMonth(-1);
          }}
          variant="ghost"
        >
          <IconChevronLeft />
          {t.previous}
        </Button>
        <Button
          onClick={() => {
            changeMonth(1);
          }}
          variant="ghost"
        >
          {t.next}
          <IconChevronRight />
        </Button>
      </div>
      <div className="grid grid-cols-7 overflow-hidden rounded border-l border-t">
        {weekdays.map((val) => (
          <div key={`${uuid}${val}:`} className="border-b border-r px-1 py-0.5">
            {val}
          </div>
        ))}

        {weeks.map((week, index) =>
          week.map((day, dayIndex) => (
            <div
              key={`${uuid}${index}:${dayIndex}:`}
              className="border-b border-r"
            >
              {day !== null ? (
                <div className="flex flex-col gap-0.5">
                  <div className="px-1 py-0.5">{day}</div>
                  <div>
                    {ordersByDay?.[day]?.map((val, indexOrderByDay) => (
                      <div
                        key={`${uuid}${index}:${dayIndex}:${indexOrderByDay}:`}
                        style={{
                          backgroundColor:
                            typeof val.id === "number"
                              ? getRandomColorByNumber(val.id)
                              : getRandomColorByString(val.id),
                        }}
                        className="cursor-pointer px-1 py-0.5"
                        onClick={() => {
                          void router.push(`/erp/order/${val.id}`);
                        }}
                      >
                        {val.name}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

export default CalendarView;
