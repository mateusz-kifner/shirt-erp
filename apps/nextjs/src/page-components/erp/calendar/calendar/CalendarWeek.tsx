import {
  getRandomColorByNumber,
  getRandomColorByString,
} from "@/utils/getRandomColor";
import useTranslation from "@/hooks/useTranslation";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useId,
  useState,
} from "react";
import dayjs, { type WeekdayNames } from "dayjs";
import Button from "@/components/ui/Button";
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import type { OrderWithoutRelations } from "@/server/api/order/validator";
import CalendarCell from "./CalendarCell";

interface CalendarWeekProps {
  currentMonth: dayjs.Dayjs;
  orders: Array<Array<OrderWithoutRelations>>;
  setCurrentMonth: Dispatch<SetStateAction<dayjs.Dayjs>>;
}

function CalendarWeek(props: CalendarWeekProps) {
  const { currentMonth, setCurrentMonth, orders } = props;

  const [localeData, setLocaleData] = useState(dayjs.localeData());

  const uuid = useId();
  const t = useTranslation();

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
      weekDays.push(Number.parseInt(currentDay.format("D")));
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
      monthYearString = `${startOfWeek.format(
        "MMMM YYYY",
      )} \\ ${endOfWeek.format("MMMM YYYY")}`;
    } else {
      monthYearString = `${startOfWeek.format("MMMM")} \\ ${endOfWeek.format(
        "MMMM YYYY",
      )}`;
    }
  }

  const today = dayjs();

  const todayDay = today.date();
  const todayMonth = today.month();
  const todayYear = today.year();

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
        className="grid h-full flex-grow grid-cols-7 overflow-hidden rounded border-t border-l"
        style={{
          gridTemplateRows: "auto 1fr ",
        }}
      >
        {weekdays.map((val) => (
          <div key={`${uuid}${val}:`} className="border-r border-b px-1 py-0.5">
            {val}
          </div>
        ))}

        {weekDays.map((day, index) => (
          <div key={`${uuid}${day}:${index}`} className="border-r border-b">
            {day !== null && (
              <CalendarCell
                highlight={
                  day === todayDay && month === todayMonth && year === todayYear
                }
                dayOrders={orders?.[day]}
                day={day}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarWeek;
