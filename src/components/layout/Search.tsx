import useTranslation from "@/hooks/useTranslation";
import ClientListItem from "@/page-components/erp/client/ClientListItem";
import OrderListItem from "@/page-components/erp/order/OrderListItem";
import { api } from "@/utils/api";
import { useDebouncedValue, useHotkeys } from "@mantine/hooks";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import Button from "../ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import { Input } from "../ui/Input";

interface SearchProps {}

function Search(props: SearchProps) {
  const {} = props;
  const uuid = useId();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslation();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  useHotkeys([
    [
      "ctrl+K",
      (e) => {
        setOpen((v) => !v);
        return false;
      },
      { preventDefault: true },
    ],
  ]);
  const { data } = api.search.all.useQuery(
    {
      query: debouncedQuery,
      itemsPerPage: 4,
    },
    { enabled: open, refetchOnMount: false, refetchOnWindowFocus: false }
  );
  return (
    <Dialog modal={true} open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <IconSearch className="stroke-gray-200" />
        </Button>
      </DialogTrigger>
      <DialogContent disableClose className="top-24 translate-y-0 p-2">
        <Input
          className="h-12"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-5 top-5 h-6 w-6 rounded-full"
          onClick={() => setQuery("")}
        >
          <IconX size={18} />
        </Button>
        <div className="flex flex-col gap-2 ">
          <span className="pl-4 italic text-gray-800 first-letter:capitalize dark:text-stone-200">
            {t.order.plural}
          </span>
          {data?.[1].map((order, index) => (
            <OrderListItem
              key={"order" + uuid + index}
              value={order}
              onChange={(order) => {
                router.push(`/erp/order/${order.id}`).catch((e) => {
                  throw e;
                });
                setOpen(false);
              }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="pl-4 italic text-gray-800 first-letter:capitalize dark:text-stone-200">
            {t.client.plural}
          </span>
          {data?.[0].map((client, index) => (
            <ClientListItem
              key={"client" + uuid + index}
              value={client}
              onChange={(client) => {
                router.push(`/erp/client/${client.id}`).catch((e) => {
                  throw e;
                });
                setOpen(false);
              }}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Search;
