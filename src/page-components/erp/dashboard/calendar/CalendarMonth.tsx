import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useId, useState } from "react";
import {
  getRandomColorByNumber,
  getRandomColorByString,
} from "@/utils/getRandomColor";
import useTranslation from "@/hooks/useTranslation";
import dayjs, { WeekdayNames } from "dayjs";
import { OrderWithoutRelations } from "@/schema/orderZodSchema";
import { useRouter } from "next/router";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import CalendarCell from "./CalendarCell";

interface CalendarMonthProps {
  currentMonth: dayjs.Dayjs;
  orders: Array<Array<OrderWithoutRelations>>;
  setCurrentMonth: Dispatch<SetStateAction<dayjs.Dayjs>>;
}

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
  const todayMonth = today.month();
  const todayYear = today.year();

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
      <div className="flex flex-grow flex-col overflow-hidden rounded">
        <div className="grid flex-grow grid-cols-7 border-l border-t">
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
                {day !== null && (
                  <CalendarCell
                    highlight={
                      day === todayDay &&
                      month == todayMonth &&
                      year === todayYear
                    }
                    dayOrders={orders?.[day]}
                    day={day}
                  />
                )}
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarMonth;
