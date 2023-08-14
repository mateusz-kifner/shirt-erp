import Pagination from "@/components/ui/Pagination";
import { EmailCredentialType } from "@/schema/emailCredential";
import { api } from "@/utils/api";
import { useId, useState } from "react";
import EmailListItem from "./EmailListItem";

interface EmailListProps {
  emailConfig: EmailCredentialType;
  mailbox?: string;
  onSelect?: (uid: number | null) => void;
}

function EmailList(props: EmailListProps) {
  const { mailbox, onSelect, emailConfig } = props;
  const uuid = useId();
  const [page, setPage] = useState(0);
  const { data, refetch } = api.email.getAll.useQuery(
    {
      mailbox,
      emailClientId: emailConfig.id,
      take: 10,
      skip: 0,
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );
  const sortedData = data
    ? data?.sort(
        // @ts-ignore
        (a, b) => new Date(b.envelope.date) - new Date(a.envelope.date),
      )
    : [];
  return (
    <div className="flex w-full flex-col justify-between gap-2 rounded p-2">
      <div className="flex flex-col gap-2">
        <div className="items-bottom grid h-10 grid-cols-3 border-b border-solid  border-b-white px-1 text-sm italic dark:border-b-stone-950">
          <div>Od</div>
          <div className="col-start-2 col-end-4 flex flex-nowrap overflow-hidden whitespace-nowrap">
            Tytuł
          </div>
        </div>
        {sortedData.map((value, index) => (
          <EmailListItem
            key={`${uuid}${index}`}
            value={value}
            onChange={(value) => onSelect?.(value.uid ?? null)}
          />
        ))}
      </div>
      <Pagination initialPage={1} totalPages={1} onPageChange={setPage} />
    </div>
  );
}

export default EmailList;
