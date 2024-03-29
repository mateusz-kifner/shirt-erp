import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import { Separator } from "@/components/ui/Separator";
import type { EmailMessage } from "@/server/api/email-message/validator";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import type { ReactNode } from "react";

interface EmailViewProps {
  data: Partial<EmailMessage>;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}

function EmailView(props: EmailViewProps) {
  const { data, leftSection, rightSection } = props;

  if (!data)
    return (
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
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
        className={`plain-html editor w-full${
          sanitizedHtml.length === 0 ||
          sanitizedHtml === "<p></p>" ||
          sanitizedHtml === "<p></p><p></p>"
            ? "text-gray-400 dark:text-stone-600"
            : "text-stone-950 dark:text-stone-200"
        }`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: This is sanitized
        dangerouslySetInnerHTML={{
          __html:
            sanitizedHtml.length === 0 ||
            sanitizedHtml === "<p></p>" ||
            sanitizedHtml === "<p></p><p></p>"
              ? "⸺"
              : sanitizedHtml,
        }}
      />
    </div>
  );
}

export default EmailView;
