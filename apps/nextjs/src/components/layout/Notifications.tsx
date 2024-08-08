import { trpc } from "@/utils/trpc";
import { useLocalStorage } from "@mantine/hooks";
import { IconBell } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useId, useState } from "react";
import { signIn, useSession } from "@shirterp/server/auth";

import Button from "@shirterp/ui-web/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shirterp/ui-web/Popover";
import { useIsMobile } from "@/hooks/useIsMobile";

const Notifications = () => {
  // const { isAuthenticated } = useAuthContext();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState<boolean>();
  const [prevActiveOrders, setPrevActiveOrders] = useLocalStorage<number>({
    key: "prevActiveOrders",
    defaultValue: 0,
  });
  const uuid = useId();
  const todayDate = dayjs().format("YYYY-MM-DD");
  const router = useRouter();
  const { data, error, isError } = trpc.session.me.useQuery(undefined, {
    retry: false,
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    if (status === "unauthenticated") {
      void signIn();
    }
  }, [status]);

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
    if ((prevActiveOrders ?? 0) < activeOrders) {
      const audio = new Audio("/notification.ogg");
      audio.loop = false;
      audio.play().catch(() => {});
    }
    setPrevActiveOrders(activeOrders);
  }, [activeOrders]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full border-stone-800 bg-stone-800 hover:bg-stone-700 hover:text-stone-50"
          // onClick={() => {
          //   // refetch();
          //   setOpened((val) => !val);
          // }}
        >
          <IconBell className="stroke-gray-200" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex w-[calc(100vw-32px)] flex-col gap-2 bg-white md:w-96 dark:bg-stone-950"
        sideOffset={10}
        align={isMobile ? "start" : "end"}
        collisionPadding={{ left: 16, right: 16 }}
      >
        <div className="flex">
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
                  <div
                    onChange={() => {
                      router.push(`/erp/task/${val?.id}`).catch(console.log);
                      setOpen(false);
                    }}
                    key={uuid + index}
                  >
                    {val?.name}
                  </div>
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
