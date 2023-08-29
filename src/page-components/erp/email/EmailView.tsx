import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import { Separator } from "@/components/ui/Separator";
import { EmailMessage } from "@/schema/emailMessageZodSchema";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import { ReactNode } from "react";

interface EmailViewProps {
  data: Partial<EmailMessage>;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}

function EmailView(props: EmailViewProps) {
  const { data, leftSection, rightSection } = props;

  if (!data)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        Brak danych
      </div>
    );

  const date = data?.date && dayjs(data.date);
  const sanitizedHtml = DOMPurify.sanitize(data.html || "<p></p>");

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-2xl">
          {!!leftSection && leftSection}
          <EditableDebugInfo
            label="ID: "
            keyName="id"
            value={data.id?.toString()}
          />
          {data.subject}
        </div>
        {!!rightSection && rightSection}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <span>od: {data?.from ?? ""}</span>
          <span>do:{data?.to}</span>
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
    </div>
  );
}

export default EmailView;
