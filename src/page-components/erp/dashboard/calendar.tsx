import Button from "@/components/ui/Button";
import useTranslation from "@/hooks/useTranslation";
import { OrderWithoutRelations } from "@/schema/orderZodSchema";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import {
  getRandomColorByNumber,
  getRandomColorByString,
} from "@/utils/getRandomColor";
import {
  IconCalendarMonth,
  IconCalendarWeek,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconUser,
  IconCrown,
} from "@tabler/icons-react";
import dayjs, { WeekdayNames } from "dayjs";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useId, useState } from "react";

interface CalendarViewProps {}

interface CalendarMonthProps {
  currentMonth: dayjs.Dayjs;
  orders: Array<Array<OrderWithoutRelations>>;
  setCurrentMonth: Dispatch<SetStateAction<dayjs.Dayjs>>;
}

// TODO: fix corners in month table
// TODO: split this into simpler components

function CalendarMonth(props: CalendarMonthProps) {
  const { currentMonth, setCurrentMonth, orders } = props;

  const [localeData, setLocaleData] = useState(dayjs.localeData());

  const uuid = useId();
  const t = useTranslation();
  const router = useRouter();

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

  const today = dayjs();

  const todayDay = today.date();
  const todayMonth = today.date();
  const todayYear = today.date();

  const month = currentMonth.date();
  const year = currentMonth.date();

  return (
    <div className="flex flex-grow flex-col gap-4">
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
            setCurrentMonth(dayjs());
          }}
          variant="ghost"
          size="icon"
        >
          <IconCalendar />
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
      <div className="flex flex-col flex-grow rounded overflow-hidden">
      <div className="grid flex-grow border-l border-t grid-cols-7">
        {weekdays.map((val) => (
          <div key={`${uuid}${val}:`} className=" border-r px-1 py-0.5">
            {val}
          </div>
        ))}
      </div>
      <div className="grid h-full  grid-cols-7   border-l border-t">
        {weeks.map((week, index) =>
          week.map((day, dayIndex) => (
            <div
              key={`${uuid}${index}:${dayIndex}:`}
              className="border-b border-r"
            >
              {day !== null ? (
                <div
                  className={cn(
                    "flex h-full flex-grow flex-col gap-0.5",
                    day === todayDay &&
                      month == todayMonth &&
                      year === todayYear &&
                      "bg-sky-700/25 ring-1 ring-sky-700/50 ring-offset-0",
                  )}
                >
                  <div className="px-1 py-0.5">{day}</div>
                  <div>
                    {orders?.[day]?.map((val, indexOrderByDay) => (
                      <div
                        key={`${uuid}${index}:${dayIndex}:${indexOrderByDay}:`}
                        style={{
                          backgroundColor:
                            typeof val.id === "number"
                              ? getRandomColorByNumber(val.id) + "aa"
                              : getRandomColorByString(val.id) + "aa",
                        }}
                        className="cursor-pointer px-1 py-0.5"
                        onClick={() => {
                          void router.push(`/erp/order/${val.id}`);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          void router.push(`/erp/task/${val.id}`);
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
    </div>
  );
}

function CalendarWeek(props: CalendarMonthProps) {
  const { currentMonth, setCurrentMonth, orders } = props;

  const [localeData, setLocaleData] = useState(dayjs.localeData());

  const uuid = useId();
  const t = useTranslation();
  const router = useRouter();

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

  const week: (number | null)[] = [];

  let firstDayOfMonth = currentMonth.startOf("month").day() - firstDayOfWeek; // Adjust for Monday as the first day of the week
  firstDayOfMonth = firstDayOfMonth < 0 ? 6 : firstDayOfMonth; // Ensure the result is within [0, 6]

  const startOfWeek = currentMonth.startOf("week");
  const endOfWeek = currentMonth.endOf("week");

  let currentDay = startOfWeek;

  const weekDays: number[] = [];

  while (
    currentDay.isBefore(endOfWeek) ||
    currentDay.isSame(endOfWeek, "day")
  ) {
    for (let i = 0; i < 7; i++) {
      weekDays.push(parseInt(currentDay.format("D")));
      currentDay = currentDay.add(1, "day");
    }
  }

  const changeWeek = (amount: number) => {
    setCurrentMonth((prevWeek) => prevWeek.add(amount, "week"));
  };

  // display month and year depending on week
  let monthYearString = startOfWeek.format("MMMM YYYY");
  if (startOfWeek.month() !== endOfWeek.month()) {
    if (startOfWeek.month() === 11 && endOfWeek.month() === 0) {
      monthYearString =
        startOfWeek.format("MMMM YYYY") +
        " \\ " +
        endOfWeek.format("MMMM YYYY");
    } else {
      monthYearString =
        startOfWeek.format("MMMM") + " \\ " + endOfWeek.format("MMMM YYYY");
    }
  }

  const today = dayjs();

  const todayDay = today.date();
  const todayMonth = today.date();
  const todayYear = today.date();

  const month = currentMonth.date();
  const year = currentMonth.date();

  return (
    <div className="flex flex-grow flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2 className="flex-grow">{monthYearString}</h2>
        <Button
          onClick={() => {
            changeWeek(-1);
          }}
          variant="ghost"
        >
          <IconChevronLeft />
          {t.previous}
        </Button>
        <Button
          onClick={() => {
            setCurrentMonth(dayjs());
          }}
          variant="ghost"
          size="icon"
        >
          <IconCalendar />
        </Button>
        <Button
          onClick={() => {
            changeWeek(1);
          }}
          variant="ghost"
        >
          {t.next}
          <IconChevronRight />
        </Button>
      </div>
      <div
        className="grid h-full flex-grow grid-cols-7 overflow-hidden rounded border-l border-t"
        style={{
          gridTemplateRows: "auto 1fr ",
        }}
      >
        {weekdays.map((val) => (
          <div key={`${uuid}${val}:`} className="border-b border-r px-1 py-0.5">
            {val}
          </div>
        ))}

        {weekDays.map((day, index) => (
          <div key={`${uuid}${day}`} className="border-b border-r ">
            {day !== null && (
              <div
                className={cn(
                  "flex h-full flex-grow flex-col gap-0.5",
                  day === todayDay &&
                    month == todayMonth &&
                    year === todayYear &&
                    "bg-sky-700/25 ring-1 ring-sky-700/50 ring-offset-0",
                )}
              >
                <div className="px-1 py-0.5">{day}</div>
                <div>
                  {orders?.[day]?.map((val, indexOrderByDay) => (
                    <div
                      key={`${uuid}${index}:${indexOrderByDay}:`}
                      style={{
                        backgroundColor:
                          typeof val.id === "number"
                            ? getRandomColorByNumber(val.id) + "aa"
                            : getRandomColorByString(val.id) + "aa",
                      }}
                      className="cursor-pointer px-1 py-0.5"
                      onClick={() => {
                        void router.push(`/erp/order/${val.id}`);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        void router.push(`/erp/task/${val.id}`);
                      }}
                    >
                      {val.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarView(props: CalendarViewProps) {
  const {} = props;

  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [mode, setMode] = useState<"month" | "week">("month");
  const [dataMode, setDataMode] = useState<"user" | "all">("user");

  const { data } = api.order.getByCompletionDateRange.useQuery({
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
        const index = parseInt(dayjs(val.dateOfCompletion).format("DD"));
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
              "border-l-none rounded-l-none",
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
              "border-l-none rounded-l-none",
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
      {mode == "month" && (
        <CalendarMonth
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          orders={ordersByDay}
        />
      )}
      {mode == "week" && (
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
