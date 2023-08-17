import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import Button, { buttonVariants } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { useLoaded } from "@/hooks/useLoaded";
import { EmailCredentialType } from "@/schema/emailCredential";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import {
  IconArrowLeft,
  IconDownload,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import Link from "next/link";
import { useRouter } from "next/router";
import { useId } from "react";

interface EmailViewProps {
  emailConfig: EmailCredentialType;
  id: number | null;
  mailbox: string;
}

function EmailView(props: EmailViewProps) {
  const { id, mailbox, emailConfig } = props;
  const isLoaded = useLoaded();
  const router = useRouter();
  const uuid = useId();
  const { data } = api.email.getByUid.useQuery(
    { emailClientId: emailConfig.id, mailbox, emailId: id as number },
    {
      enabled: id !== null,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  const { mutateAsync: transferEmail} = api.email.downloadByUid.useMutation()

  if (!data)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        Brak danych
      </div>
    );

  if (data.avIsInfected)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        Email zawiera wirusy
      </div>
    );

  const date = data?.date && dayjs(data.date);
  const sanitizedHtml = DOMPurify.sanitize(data.html || "<p></p>");

  return (
    <div className="flex flex-col gap-2 p-2">
      <Button onClick={()=>{id !== null && transferEmail({emailClientId:emailConfig.id, emailId: id , mailbox})}}>{data ? "transfered" : "transferEmail"}</Button>
      <div className="flex items-center gap-3 text-2xl">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full"
          onClick={() =>
            router.push(
              `/erp/email/${emailConfig.user}/${
                mailbox ? mailbox.replace("/", "-") : "INBOX"
              }`,
            )
          }
        >
          <IconArrowLeft />
        </Button>
        <EditableDebugInfo label="ID: " keyName="id" value={id?.toString()} />
        {data.subject}
        {data.priority === "high" && <IconStarFilled />}
        {data.priority === "low" && <IconStarHalfFilled />}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <span>od: {data?.from?.text ?? ""}</span>
          <span>
            do:{" "}
            {(Array.isArray(data?.to)
              ? data.to
                  .map((v) => v.text)
                  .reduce((p, n, i) => (i == 0 ? n : `${p}, ${n}`))
              : data?.to?.text) ?? ""}
          </span>
        </div>
        <div className="flex gap-2">
          <span>{dayjs(date).format("L, LT").toString()}</span>
          <span>({dayjs(date).fromNow()})</span>
        </div>
      </div>
      <Separator />

      <div
        className={`plain-html editor w-full ${
          sanitizedHtml.length === 0 ||
          sanitizedHtml === "<p></p>" ||
          sanitizedHtml === "<p></p><p></p>"
            ? "text-gray-400 dark:text-stone-600"
            : "text-stone-950 dark:text-stone-200"
        }`}
        dangerouslySetInnerHTML={{
          __html:
            sanitizedHtml.length === 0 ||
            sanitizedHtml === "<p></p>" ||
            sanitizedHtml === "<p></p><p></p>"
              ? "⸺"
              : sanitizedHtml,
        }}
      ></div>
      <div className="flex flex-col">
        {data.attachments.map((file, index) => (
          <div
            className="relative flex items-center gap-2 overflow-hidden border-l border-r border-t border-solid border-gray-400 first:rounded-t last:rounded-b last:border-b dark:border-stone-600"
            key={`${uuid}${index}:attachments`}
          >
            <div className="relative h-[100px] w-[100px] min-w-[100px] overflow-hidden  child-hover:visible">
              <img
                src={
                  file.preview
                    ? `data:image/jpeg;base64,${file.preview}`
                    : "/assets/unknown_file.svg"
                }
                alt=""
                width={100}
                height={100}
                className="h-[100px] w-[100px]  border-b-0 border-l-0 border-r border-t-0 border-gray-400 object-cover dark:border-stone-600"
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-[calc(100% - 180px)] mr-20 max-h-[90px] break-all">
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
                `absolute 
            -right-12
            top-1/2
            h-32
            w-32
            -translate-y-1/2
            rounded-full
            hover:bg-black/15
            dark:hover:bg-white/10`,
              )}
            >
              <IconDownload size={26} />
              <div style={{ width: "2.4rem" }}></div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmailView;
