import OrderListItem from "@/page-components/erp/order/OrderListItem";
import { api } from "@/utils/api";
import { useLocalStorage } from "@mantine/hooks";
import dayjs from "dayjs";
import { BellIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useId, useState } from "react";
import ActionButton from "./ui/ActionButton";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";

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
  const {data} = api.session.me.useQuery()
  

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
    <Popover
      // width={400}
      // position="bottom-end"
      // arrowOffset={12}
      // offset={4}
      // withArrow
      // shadow="md"
      // open={opened}
      // onChange={setOpened}
    >
      <PopoverTrigger>
        <ActionButton
          onClick={() => {
            // refetch();
            setOpened((val) => !val);
          }}
        >
          {/* <Indicator
            position="bottom-end"
            color="blue"
            disabled={activeOrders == 0}
          > */}
            <BellIcon />
          {/* </Indicator> */}
        </ActionButton>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <h1>
              <BellIcon size={18} /> Powiadomienia{" "}
            </h1>
          </div>

          {activeOrders ? (
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
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
