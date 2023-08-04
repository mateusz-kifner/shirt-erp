import { api } from "@/utils/api";
import { useId } from "react";
import EmailListItem from "./EmailListItem";

interface EmailListProps {
  emailClientId: number;
  mailbox?: string;
}

function EmailList(props: EmailListProps) {
  const { emailClientId, mailbox } = props;
  const uuid = useId();
  const { data } = api.email.getAll.useQuery(
    {
      mailbox,
      emailClientId,
      take: 10,
      skip: 0,
    },
    { refetchOnWindowFocus: true },
  );
  const sortedData = data
    ? data?.sort(
        // @ts-ignore
        (a, b) => new Date(b.envelope.date) - new Date(a.envelope.date),
      )
    : [];
  return (
    <div className="flex w-full flex-col gap-2">
      {sortedData.map((value, index) => (
        <EmailListItem key={`${uuid}${index}`} value={value} />
      ))}
    </div>
  );
}

export default EmailList;
