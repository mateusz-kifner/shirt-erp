import { api } from "@/utils/api";
import { useLocalStorage } from "@mantine/hooks";
import { IconBell } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useId, useState } from "react";

import Button from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

const Notifications = () => {
  // const { isAuthenticated } = useAuthContext();
  const [opened, setOpened] = useState<boolean>();
  const [prevActiveOrders, setPrevActiveOrders] = useLocalStorage<number>({
    key: "prevActiveOrders",
    defaultValue: 0,
  });
  const uuid = useId();
  const todayDate = dayjs().format("YYYY-MM-DD");
  const router = useRouter();
  const { data } = api.session.me.useQuery();

  const activeOrders = data?.orders
    ? data?.orders.filter((val) => {
        const timeLeft = val?.dateOfCompletion
          ? dayjs(val?.dateOfCompletion).diff(todayDate, "day")
          : null;
        return (
          !(
            val?.status === "rejected" ||
            val?.status === "archived" ||
            val?.status === "sent"
          ) &&
          timeLeft !== null &&
          timeLeft < 7 &&
          timeLeft > -1
        );
      }).length
    : 0;

  useEffect(() => {
    if (prevActiveOrders < activeOrders) {
      const audio = new Audio("/notification.ogg");
      audio.loop = false;
      audio.play().catch(() => {});
    }
    setPrevActiveOrders(activeOrders);
  }, [activeOrders]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full border-stone-600 bg-stone-800 hover:bg-stone-700 hover:text-stone-50"
          onClick={() => {
            // refetch();
            setOpened((val) => !val);
          }}
        >
          <IconBell className="stroke-gray-200" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2" sideOffset={10}>
        <div className="flex justify-between">
          <h1>
            <IconBell size={18} /> Powiadomienia{" "}
          </h1>
        </div>

        {/* {activeOrders ? (
          data?.orders
            .sort((a, b) =>
              dayjs(a.dateOfCompletion).diff(dayjs(b.dateOfCompletion))
            )
            .map((val, index) => {
              const timeLeft = val?.dateOfCompletion
                ? dayjs(val?.dateOfCompletion).diff(todayDate, "day")
                : null;
              if (
                !(
                  val?.status === "rejected" ||
                  val?.status === "archived" ||
                  val?.status === "sent"
                ) &&
                timeLeft !== null &&
                timeLeft < 7 &&
                timeLeft > -1
              ) {
                return (
                  <OrderListItem
                    value={val}
                    onChange={(val) => {
                      router.push("/erp/tasks/" + val.id);
                      setOpened(false);
                    }}
                    key={uuid + index}
                  />
                );
              }
              return null;
            })
        ) : (
          <div>Brak powiadomień</div>
        )} */}
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
