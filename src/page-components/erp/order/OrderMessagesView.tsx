import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useTranslation from "@/hooks/useTranslation";
import { EmailMessageType } from "@/schema/emailMessage";
import { OrderType } from "@/schema/orderSchema";
import { useId, useMemo, useState } from "react";

interface OrderMessagesViewProps {
  order?: Partial<OrderType>;
  refetch?: () => void;
}

const OrderMessagesView = (props: OrderMessagesViewProps) => {
  const { order, refetch } = props;
  const uuid = useId();

  const [active, setActive] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);
  const t = useTranslation();

  const emailMessagesSorted: EmailMessageType[] | null = useMemo(
    () =>
      (order &&
        order.emails &&
        Array.isArray(order?.emails) &&
        (order.emails.sort(
          sortObjectByDateOrNull("date"),
        ) as EmailMessageType[])) ||
      null,
    [order?.emails],
  );

  return (
    <div className="relative">
      <Accordion type="multiple">
        {emailMessagesSorted && emailMessagesSorted.length > 0 ? (
          emailMessagesSorted.map((val, index, arr) => (
            <AccordionItem value={"email" + index} key={`${uuid}mail:${index}`}>
              <AccordionTrigger>{val.subject}</AccordionTrigger>
              <AccordionContent className="whitespace-pre-wrap">
                {val.text}
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <div className="bold">Brak e-maili</div>
        )}
      </Accordion>
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t["email-message"].plural}</DialogTitle>
          </DialogHeader>

          <div>test</div>
        </DialogContent>
        {/* <ApiEntryEditable
          template={template}
          entryName={"orders"}
          id={order?.id ?? null}
        /> */}
      </Dialog>
      {/* <Editable active={active} template={template} data={order ?? {}} /> */}
      {/* <FloatingActions
        actions={[
          () => setOpened((val) => !val),

          () => {
            axios
              .get("/email-messages/refresh")
              .then((res) => console.log(res.data))
              .catch((err) => console.log(err));
            refetch?.();
          },
        ]}
        actionIcons={[
          <IconEdit size={28} key={uuid + "_icon1"} />,
          <IconRefresh size={20} key={uuid + "_icon2"} />,
        ]}
      /> */}
    </div>
  );
};

export default OrderMessagesView;
