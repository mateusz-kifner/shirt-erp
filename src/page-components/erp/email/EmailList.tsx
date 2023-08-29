import Pagination from "@/components/ui/Pagination";
import useTranslation from "@/hooks/useTranslation";
import { EmailCredential } from "@/schema/emailCredentialZodSchema";
import { api } from "@/utils/api";
import { useDebouncedValue } from "@mantine/hooks";
import { useId, useState } from "react";
import EmailListItem from "./EmailListItem";

interface EmailListProps {
  emailConfig: EmailCredential;
  mailbox?: string;
  onSelect?: (uid: number | null) => void;
}

function EmailList(props: EmailListProps) {
  const { mailbox, onSelect, emailConfig } = props;
  const uuid = useId();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 150);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const t = useTranslation();
  const { data, refetch } = api.email.getAll.useQuery(
    {
      mailbox,
      emailClientId: emailConfig.id,
      take: itemsPerPage,
      skip: itemsPerPage * (page - 1),
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: query.length === 0,
    },
  );

  const { data: dataSearch } = api.email.search.useQuery(
    {
      mailbox,
      emailClientId: emailConfig.id,
      query: debouncedQuery,
      // take: itemsPerPage,
      // skip: itemsPerPage * (page - 1),
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: query.length > 2,
    },
  );

  const searchMessages =
    dataSearch && dataSearch.results
      ? dataSearch.results?.sort(
          // @ts-ignore
          (a, b) => new Date(b.envelope.date) - new Date(a.envelope.date),
        )
      : [];

  const normalMessages =
    data && data?.results
      ? data.results?.sort(
          // @ts-ignore
          (a, b) => new Date(b.envelope.date) - new Date(a.envelope.date),
        )
      : [];

  const messages = query.length > 0 ? searchMessages : normalMessages;

  const totalPages = Math.ceil((data?.totalItems ?? 9999) / itemsPerPage);

  return (
    <div className="flex w-full flex-col justify-between gap-2 rounded p-2">
      <div className="flex flex-col gap-2">
        <div>
          <input
            name={"search" + uuid}
            id={"search" + uuid}
            className="
                data-disabled:text-gray-500
                dark:data-disabled:text-gray-500
                data-disabled:bg-transparent 
                dark:data-disabled:bg-transparent
                h-9
                max-h-screen
                w-full
                resize-none
                gap-2 
                overflow-hidden
                whitespace-pre-line 
                break-words
                rounded-full
                border
                border-solid 
                border-gray-400
                bg-white
                px-4
                py-2
                text-sm
                leading-normal 
                outline-none 
                read-only:bg-transparent
                read-only:outline-none
                focus:border-sky-600
                dark:border-stone-600
                dark:bg-stone-800 
                dark:outline-none 
                dark:read-only:bg-transparent 
                dark:read-only:outline-none
                dark:focus:border-sky-600"
            type="text"
            defaultValue={""}
            onChange={(value) => setQuery(value.target.value)}
            placeholder={`${t.search}...`}
          />
        </div>
        <div className="items-bottom grid h-10 grid-cols-3 border-b border-solid  border-b-white px-1 text-sm italic dark:border-b-stone-950">
          <div>Od</div>
          <div className="col-start-2 col-end-4 flex flex-nowrap overflow-hidden whitespace-nowrap">
            Tytuł
          </div>
        </div>
        {messages.map((value, index) => (
          <EmailListItem
            key={`${uuid}${index}`}
            value={value}
            onChange={(value) => onSelect?.(value.uid ?? null)}
          />
        ))}
      </div>
      {query.length === 0 && (
        <Pagination
          initialPage={1}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export default EmailList;
