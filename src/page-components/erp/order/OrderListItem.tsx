import { DefaultListItem } from "@/components/DefaultListItem";
import useTranslation from "@/hooks/useTranslation";
import { type OrderType } from "@/schema/orderSchema";
import { truncString } from "@/utils/truncString";
import { IconCalendarTime } from "@tabler/icons-react";
import dayjs from "dayjs";

interface OrderListItemProps {
  onChange?: (item: Partial<OrderType>) => void;
  value: Partial<OrderType>;
  active?: boolean;
  disabled?: boolean;
}

const OrderListItem = (props: OrderListItemProps) => {
  const value = props.value;
  const t = useTranslation();
  const todayDate = dayjs().format("YYYY-MM-DD");
  const timeLeft = value?.dateOfCompletion
    ? dayjs(value?.dateOfCompletion).diff(todayDate, "day")
    : null;

  const color =
    timeLeft !== null
      ? timeLeft < 1
        ? "#F03E3E"
        : timeLeft < 3
        ? "#FF922B"
        : timeLeft < 5
        ? "#FAB005"
        : "transparent"
      : "transparent";
  const dateDisplay = value?.dateOfCompletion
    ? (timeLeft !== null && timeLeft < 0) ||
      value?.status === "rejected" ||
      value?.status === "archived" ||
      value?.status === "sent"
      ? dayjs(value?.dateOfCompletion).format("L")
      : timeLeft === 0
      ? t.today
      : dayjs(value?.dateOfCompletion).from(todayDate)
    : "";
  return (
    <DefaultListItem
      firstElement={value ? value?.name && truncString(value.name, 20) : "⸺"}
      secondElement={
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        (value?.status
          ? truncString(
              (t[value.status as keyof typeof t] as string) ?? "",
              20
            ) + " | "
          : "") +
        dateDisplay +
        (value?.client?.firstname || value?.client?.lastname ? " | " : "") +
        (value?.client?.firstname ? value?.client?.firstname + " " : "") +
        (value?.client?.lastname ?? "")
      }
      avatarElement={value?.name && value.name.substring(0, 2)}
      rightSection={
        !(
          value?.status === "rejected" ||
          value?.status === "archived" ||
          value?.status === "sent"
        ) && timeLeft !== null ? (
          <IconCalendarTime size={18} stroke={color} />
        ) : undefined
      }
      {...props}
    />
  );
};

export default OrderListItem;

// const OrderListItem = ({
//   value,
//   onChange,
//   active,
//   disabled,
// }: OrderListItemProps) => {
//   const { t } = useTranslation();
//   const todayDate = dayjs().format("YYYY-MM-DD");
//   const timeLeft = value?.dateOfCompletion
//     ? dayjs(value?.dateOfCompletion).diff(todayDate, "day")
//     : null;

//   const color =
//     timeLeft !== null
//       ? timeLeft < 1
//         ? "#F03E3E"
//         : timeLeft < 3
//         ? "#FF922B"
//         : timeLeft < 5
//         ? "#FAB005"
//         : "transparent"
//       : "transparent";

//   const dateDisplay = value?.dateOfCompletion
//     ? (timeLeft !== null && timeLeft < 0) ||
//       value?.status === "rejected" ||
//       value?.status === "archived" ||
//       value?.status === "sent"
//       ? dayjs(value?.dateOfCompletion).format("L")
//       : timeLeft === 0
//       ? t("today")
//       : dayjs(value?.dateOfCompletion).from(todayDate)
//     : "";
//   return (
//     <NavLink
//       disabled={disabled}
//       icon={
//         value && (
//           <Avatar
//             radius="xl"
//             styles={{
//               placeholder: {
//                 background: `radial-gradient(circle, transparent 64%, ${
//                   value?.order?.id
//                     ? getRandomColorByNumber(value?.order?.id)
//                     : "#333"
//                 }  66%)`,
//               },
//             }}
//           >
//             {value?.name && value.name.substring(0, 2)}
//           </Avatar>
//         )
//       }
//       label={value ? value?.name && truncString(value.name, 20) : "⸺"}
//       description={
//         (value?.status ? truncString(t(value.status), 20) + " | " : "") +
//         dateDisplay +
//         (value?.order?.firstname || value?.order?.lastname ? " | " : "") +
//         (value?.order?.firstname ? value?.order?.firstname + " " : "") +
//         (value?.order?.lastname ?? "")
//       }
//       onClick={() => onChange?.(value)}
//       active={active}
//       rightSection={
//         !(
//           value?.status === "rejected" ||
//           value?.status === "archived" ||
//           value?.status === "sent"
//         ) && timeLeft !== null ? (
//           <IconCalendarTime size={18} stroke={color} />
//         ) : undefined
//       }
//     />
//   );
// };

// export default OrderListItem;
