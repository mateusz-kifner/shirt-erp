import Button from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import useTranslation from "@/hooks/useTranslation";
import CustomerListItem from "@/page-components/erp/customer/CustomerListItem";
import OrderListItem from "@/page-components/erp/order/OrderListItem";
import { trpc } from "@/utils/trpc";
import { useDebouncedValue, useHotkeys } from "@mantine/hooks";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useId, useState } from "react";

function Search() {
  const uuid = useId();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslation();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);
  useHotkeys([
    [
      "ctrl+K",
      () => {
        setOpen((v) => !v);
        return false;
      },
      { preventDefault: true },
    ],
  ]);
  const { data } = trpc.search.all.useQuery(
    {
      query: debouncedQuery,
      itemsPerPage: 4,
    },
    { enabled: open, refetchOnMount: false, refetchOnWindowFocus: false },
  );
  return (
    <Dialog modal={true} open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-stone-800 bg-stone-800 hover:bg-stone-700 hover:text-stone-50"
        >
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
          className="absolute top-5 right-5 h-6 w-6 rounded-full"
          onClick={() => setQuery("")}
        >
          <IconX size={18} />
        </Button>
        <div className="flex flex-col gap-2">
          <span className="pl-4 text-gray-800 italic dark:text-stone-200 first-letter:capitalize">
            {t.order.plural}
          </span>
          {data?.[1].map((order, index) => (
            <OrderListItem
              key={`order${uuid}${index}`}
              value={order}
              onChange={(order) => {
                void router.push(`/erp/order/${order.id}`);
                setOpen(false);
              }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <span className="pl-4 text-gray-800 italic dark:text-stone-200 first-letter:capitalize">
            {t.customer.plural}
          </span>
          {data?.[0].map((customer, index) => (
            <CustomerListItem
              key={`customer${uuid}${index}`}
              value={customer}
              onChange={(customer) => {
                void router.push(`/erp/customer/${customer.id}`);
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
