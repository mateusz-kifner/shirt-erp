import {
  IconCheck,
  IconColorSwatch,
  IconList,
  IconMail,
  IconNotebook,
  IconRefresh,
  IconRuler2,
  IconSortAscending,
  IconSortDescending,
  IconTable,
} from "@tabler/icons-react";
import { useRouter } from "next/router";

import List from "@/components/List";
import SpreadsheetView from "@/components/Spreadsheet/SpreadsheetView";
import verifyMetadata from "@/components/Spreadsheet/verifyMetadata";
import Workspace from "@/components/layout/Workspace";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import useTranslation from "@/hooks/useTranslation";
import OrderListItem from "@/page-components/erp/order/OrderListItem";
import OrderMessagesView from "@/page-components/erp/order/OrderMessagesView";
import TaskView from "@/page-components/erp/task/TaskView";
import { trpc } from "@/utils/trpc";
import { getQueryAsIntOrNull } from "@/utils/query";
import sortObjectByDateOrNull from "@/utils/sortObjectByDateOrNull";
import { useToggle } from "@mantine/hooks";
import _ from "lodash";
import { useId, useState } from "react";
import api from "@/hooks/api";
import { createRedirectByRole } from "@/utils/redirectByRole";

const entryName = "task";

const itemsPerPage = 10;

const TasksPage = () => {
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");
  const { data } = trpc.session.me.useQuery();
  const uuid = useId();
  const t = useTranslation();
  const [sortOrder, toggleSortOrder] = useToggle<"asc" | "desc">([
    "asc",
    "desc",
  ]);
  const [query, setQuery] = useState("");

  const { data: orderData } = api.order.useGetById(id);
  const { data: productsData } = api.order.useGetRelatedProducts(id);
  const { data: spreadsheetData } = api.order.useGetRelatedSpreadsheets(id);

  const label = entryName ? _.capitalize(t[entryName].plural) : undefined;

  const childrenMetadata = [
    { label: "Właściwości", icon: IconNotebook },
    { label: "E-maile", icon: IconMail },
    ...(spreadsheetData
      ? spreadsheetData.map((sheet) => ({
          label: sheet.name ?? `[${t.sheet}]`,
          icon: IconTable,
        }))
      : []),
  ];

  const metadata = productsData
    ? productsData?.reduce((prev: Record<string, { id: number }>, next) => {
        prev[`${next.name}:${next.id}` ?? `[NAME NOT SET] ${next.id}`] = {
          id: next.id,
        };
        return prev;
      }, {})
    : {};
  const [page, setPage] = useState(1);
  const filteredOrders =
    data?.orders
      .filter(
        (val) =>
          (val.name?.includes(query) || val.notes?.includes(query)) &&
          !val.name?.startsWith("Szablon"),
      )
      .sort(sortObjectByDateOrNull("dateOfCompletion", sortOrder)) ?? [];

  const totalPages = Math.ceil((filteredOrders.length ?? 1) / itemsPerPage);

  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        navigationMetadata={[{ label: "", icon: IconList }]}
        childrenMetadata={id !== null ? childrenMetadata : []}
        navigation={
          <div className="relative flex flex-col gap-2 p-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between px-2">
                <h2 className="font-bold text-2xl">{label}</h2>
                <div className="flex gap-2">
                  {/* {!!buttonSection && buttonSection} */}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 rounded-full border-gray-400 p-1 text-gray-700 dark:border-stone-600 dark:text-stone-400"
                    onClick={() => {
                      // refetch()
                      // onRefresh?.();
                    }}
                  >
                    <IconRefresh />
                  </Button>
                  {/* {showAddButton && (
            <Button
              size="icon"
              variant="outline"
              className="
                  h-9
                  w-9
                  rounded-full                 
                  border-gray-400
                  p-1 
                  text-gray-700
                  dark:border-stone-600
                dark:text-stone-400
                "
              onClick={onAddElement}
            >
              <IconPlus />
            </Button>
          )} */}
                </div>
              </div>
              <div className="flex gap-3 px-2.5">
                <div className="flex">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 rounded-full border-gray-400 p-1 text-gray-700 dark:border-stone-600 dark:text-stone-400"
                    onClick={() => toggleSortOrder()}
                  >
                    {sortOrder === "asc" ? (
                      <IconSortDescending />
                    ) : (
                      <IconSortAscending />
                    )}
                  </Button>
                </div>
                <input
                  name={`search${uuid}`}
                  id={`search${uuid}`}
                  className="h-9 max-h-screen w-full resize-none gap-2 overflow-hidden whitespace-pre-line break-words rounded-full border border-gray-400 border-solid bg-white px-4 py-2 text-sm leading-normal outline-none dark:border-stone-600 dark:focus:border-sky-600 focus:border-sky-600 dark:bg-stone-800 dark:data-disabled:bg-transparent dark:read-only:bg-transparent data-disabled:bg-transparent read-only:bg-transparent dark:data-disabled:text-gray-500 data-disabled:text-gray-500 dark:outline-none dark:read-only:outline-none read-only:outline-none"
                  type="text"
                  onChange={(value) => setQuery(value.target.value)}
                  placeholder={`${t.search}...`}
                />
              </div>
            </div>
            <div className="flex flex-grow flex-col">
              <List
                ListItem={OrderListItem}
                data={filteredOrders.filter(
                  (val, index) =>
                    index >= (page - 1) * itemsPerPage &&
                    index < page * itemsPerPage,
                )}
                onChange={(val) => {
                  router.push(`/erp/task/${val.id}`).catch(console.log);
                }}
                selectedId={id}
              />
            </div>
            <Pagination
              totalPages={totalPages}
              initialPage={1}
              onPageChange={setPage}
            />
          </div>
        }
      >
        {id !== null && (
          <div className="relative flex flex-col gap-4 p-4">
            <TaskView id={id} />
          </div>
        )}
        <div className="relative p-4">
          {orderData && <OrderMessagesView orderId={orderData.id} />}
        </div>
        {spreadsheetData?.map((val, index) => (
          <SpreadsheetView
            key={`${uuid}spreadsheet:${index}:`}
            id={val.id}
            metadata={metadata}
            metadataVisuals={[
              { icon: IconColorSwatch, label: "Color" },
              { icon: IconRuler2, label: "Size" },
            ]}
            metadataActions={[
              {
                icon: IconCheck,
                label: "Sprawdź poprawność pól",
                action: verifyMetadata,
              },
            ]}
          />
        ))}
      </Workspace>
    </div>
  );
};

export const getServerSideProps = createRedirectByRole("employee");

export default TasksPage;
