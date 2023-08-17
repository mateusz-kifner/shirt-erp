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
import { useIsMobile } from "@/hooks/useIsMobile";
import OrderListItem from "@/page-components/erp/order/OrderListItem";

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
  const { data, error, isError } = api.session.me.useQuery(undefined, {
    retry: false,
  });
  const { isMobile } = useIsMobile();
  useEffect(() => {
    if (
      isError &&
      error?.data?.httpStatus === 403 &&
      error.message === "User not authenticated"
    ) {
      void router.push("/login");
    }
  }, [error]);

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
      <PopoverContent
        className="flex w-[calc(100vw-32px)] flex-col gap-2 bg-white dark:bg-stone-950 md:w-96"
        sideOffset={10}
        align={isMobile ? "start" : "end"}
        collisionPadding={{ left: 16, right: 16 }}
      >
        <div className="flex ">
          <IconBell size={18} /> Powiadomienia
        </div>

        {activeOrders ? (
          data?.orders
            .sort((a, b) =>
              dayjs(a.dateOfCompletion).diff(dayjs(b.dateOfCompletion)),
            )
            .filter((_, index) => index < 10)
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
                      router.push(`/erp/task/${val.id}`);
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
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
