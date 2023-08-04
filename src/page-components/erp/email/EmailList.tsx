import { api } from "@/utils/api";
import { useId } from "react";

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
    <div className="flex flex-col gap-2">
      {sortedData.map((v, index) => (
        <div className="flex gap-2" key={`${uuid}${index}`}>
          <div>{v.uid}</div>
          <div>{v.envelope.subject}</div>
        </div>
      ))}
    </div>
  );
}

export default EmailList;
