import ApiList from "@/components/ApiListOld";
import Button, { buttonVariants } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
// import { useLoaded } from "@/hooks/useLoaded";
import useTranslation from "@/hooks/useTranslation";
import type { EmailCredential } from "@/server/api/email/validator";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/cn";
import {
  IconArrowLeft,
  IconDownload,
  IconLink,
  IconLoader2,
} from "@tabler/icons-react";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useId, useState } from "react";
import OrderListItem from "../order/OrderListItem";
import EmailView from "./EmailView";
import type { OrderWithoutRelations } from "@/server/api/order/validator";
import api from "@/hooks/api";

interface EmailViewApiProps {
  emailConfig: EmailCredential;
  id: number | null;
  mailbox: string;
}

function EmailViewApi(props: EmailViewApiProps) {
  const { id, mailbox, emailConfig } = props;
  // const isLoaded = useLoaded();
  const router = useRouter();
  const uuid = useId();
  const { data } = trpc.email.getByUid.useQuery(
    { emailClientId: emailConfig.id, mailbox, emailId: id as number },
    {
      enabled: id !== null,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );
  const t = useTranslation();
  const [orderId, setOrderId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const { data: orderData, isSuccess } = api.order.useGetById(orderId);
  const { data: emailsData } = api.order.useGetRelatedEmails(orderId);
  const { data: filesData } = api.order.useGetRelatedFiles(orderId);

  const { mutateAsync: orderUpdate, isLoading: isLoading2 } =
    api.order.useUpdate();

  const { mutateAsync: transferEmail, isLoading } =
    trpc.email.downloadByUid.useMutation();

  useEffect(() => {
    if (id !== null && isSuccess && orderData) {
      transferEmail({
        emailClientId: emailConfig.id,
        emailId: id,
        mailbox,
      })
        .then((newMail) => {
          const emailsIds = [
            ...(emailsData ?? []).map((v) => v.id),
            newMail.id,
          ];
          const filesIds = [
            ...(filesData ?? []).map((v) => v.id),
            ...newMail.attachments.map((v) => v.id),
          ];

          orderUpdate({ id: orderData.id, emails: emailsIds, files: filesIds })
            .then(() => setOpen(false))
            .catch(console.log);
          setOrderId(null);
        })
        .catch(console.log);
    }
  }, [orderId, isSuccess]);

  if (!data)
    return (
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
        Brak danych
      </div>
    );

  if (data.avIsInfected)
    return (
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
        Email zawiera wirusy
      </div>
    );

  return (
    <div className="flex flex-col gap-2 p-2">
      <EmailView
        data={{
          subject: data.subject,
          from: data.from?.text,
          to:
            (Array.isArray(data?.to)
              ? data.to
                  .map((v) => v.text)
                  .reduce((p, n, i) => (i === 0 ? n : `${p}, ${n}`))
              : data?.to?.text) ?? "",
          date: data.date,
          messageUid: id ?? null,
          html: data.html ? data.html : "",
          text: data.text,
        }}
        rightSection={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="rounded-full">
              <Button size="icon" variant="ghost">
                <IconLink />
              </Button>
            </DialogTrigger>
            <DialogContent>
              {isLoading ||
                (isLoading2 && (
                  <div className="absolute inset-0 flex flex-col justify-center text-center align-middle backdrop-blur-sm">
                    {isLoading && "Przetwarzanie email-a"}
                    {isLoading2 && "Aktualizacja zamówienia"}
                    <div className="flex w-full justify-center align-middle">
                      <IconLoader2 size={44} className="animate-spin" />
                    </div>
                  </div>
                ))}
              <ApiList
                ListItem={OrderListItem}
                entryName={"order"}
                label={_.capitalize(t.order.plural)}
                onChange={(val: OrderWithoutRelations) => {
                  setOrderId(val.id);
                }}
                listItemProps={
                  {
                    // linkTo: (val: { id: number }) => `/erp/${entryName}/${val.id}`,
                  }
                }

                // {...orderListSearchParams}
              />
            </DialogContent>
          </Dialog>
        }
        leftSection={
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              router
                .push(
                  `/erp/email/${emailConfig.user}/${
                    mailbox ? mailbox.replace("/", "-") : "INBOX"
                  }`,
                )
                .catch(console.log);
            }}
          >
            <IconArrowLeft />
          </Button>
        }
      />

      <div className="flex flex-col">
        {data.attachments.map((file, index) => (
          <div
            className="relative flex items-center gap-2 overflow-hidden border-gray-400 border-t border-r border-l border-solid first:rounded-t last:rounded-b dark:border-stone-600 last:border-b"
            key={`${uuid}${index}:attachments`}
          >
            <div className="relative h-[100px] w-[100px] min-w-[100px] overflow-hidden child-hover:visible">
              <img
                src={
                  file.preview
                    ? `data:image/jpeg;base64,${file.preview}`
                    : "/assets/unknown_file.svg"
                }
                alt=""
                width={100}
                height={100}
                className="h-[100px] w-[100px] border-gray-400 border-t-0 border-r border-b-0 border-l-0 object-cover dark:border-stone-600"
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="- 180px)] mr-20 max-h-[90px] w-[calc(100% break-all">
                  {file.name}
                </div>
              </TooltipTrigger>
              {!(file?.name && file?.name?.length < 40) && (
                <TooltipContent className="w-80 whitespace-normal break-all dark:whitespace-normal">
                  {file?.name}
                </TooltipContent>
              )}
            </Tooltip>

            <Link
              href={`/api/email/${emailConfig.user}/${mailbox}/${id}/download/${file.name}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "-right-12 -translate-y-1/2 absolute top-1/2 h-32 w-32 rounded-full dark:hover:bg-white/10 hover:bg-black/15",
              )}
            >
              <IconDownload size={26} />
              <div style={{ width: "2.4rem" }} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmailViewApi;
