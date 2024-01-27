import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import useTranslation from "@/hooks/useTranslation";
import { type NewEmailMessage } from "@/schema/emailMessageZodSchema";
import { type NewOrder } from "@/schema/orderZodSchema";
import sortObjectByDateOrNull from "@/utils/sortObjectByDateOrNull";
import { omit } from "lodash";
import { useId, useMemo, useState } from "react";
import EmailView from "../email/EmailView";
import { useApiOrderGetById } from "@/hooks/api/order";

interface OrderMessagesViewProps {
  orderId?: number;
  refetch?: () => void;
}

const OrderMessagesView = (props: OrderMessagesViewProps) => {
  const { orderId } = props;
  const uuid = useId();

  const [opened, setOpened] = useState<boolean>(false);
  const t = useTranslation();

  const { orderQuery, emailsQuery } = useApiOrderGetById(orderId);
  const { data: orderData } = orderQuery;
  const { data: emailData } = emailsQuery;

  const emailMessagesSorted: NewEmailMessage[] | null = useMemo(
    () => (emailData && emailData.sort(sortObjectByDateOrNull("date"))) || null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderData?.emails],
  );
  return (
    <div className="relative">
      {emailMessagesSorted && emailMessagesSorted.length > 0 ? (
        <Accordion type="multiple" defaultValue={["email0"]}>
          {emailMessagesSorted.map((val, index) => (
            <AccordionItem value={"email" + index} key={`${uuid}mail:${index}`}>
              <AccordionTrigger className=" text-xl font-bold">
                {val.subject}
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-wrap">
                <EmailView data={omit(val, ["subject"])} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="font-bold">Brak e-maili</div>
      )}
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.emailMessage.plural}</DialogTitle>
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
