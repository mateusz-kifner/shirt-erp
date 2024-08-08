import { useId, useState } from "react";

// import * as XLSX from "xlsx"
//import Design from "@/components/Design/Design";
import Spreadsheet from "@/components/Spreadsheet/Spreadsheet";
import type {
  UniversalCell,
  UniversalMatrix,
} from "@/components/Spreadsheet/useSpreadSheetData";
import verifyMetadata from "@/components/Spreadsheet/verifyMetadata";
import { getColorNameFromHex } from "@/components/editable/EditableColor";
import Workspace from "@/components/layout/Workspace";
import Button from "@shirterp/ui-web/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shirterp/ui-web/DropdownMenu";
import useTranslation from "@/hooks/useTranslation";
import OrderAddModal from "@/page-components/erp/order/OrderAddModal";
import OrderEditable from "@/page-components/erp/order/OrderEditable";
import OrderList from "@/page-components/erp/order/OrderList";
import OrderMessagesView from "@/page-components/erp/order/OrderMessagesView";
//import designBackgrounds from "@/page-components/erp/order/designBackgrounds";
import { trpc } from "@/utils/trpc";
import { getQueryAsIntOrNull } from "@/utils/query";
import {
  IconBuildingFactory2,
  IconCheck,
  IconColorSwatch,
  IconDotsVertical,
  IconList,
  IconMail,
  IconNotebook,
  IconPlus,
  IconRobot,
  IconRuler2,
  IconTable,
  IconTrashX,
} from "@tabler/icons-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useLoaded } from "@/hooks/useLoaded";
import type { Key } from "@/components/editable/Editable";
import OrderCustomerView from "@/page-components/erp/order/OrderCustomerView";
import { IconAddressBook } from "@tabler/icons-react";
import OrderProductionView from "@/page-components/erp/order/OrderProductionView";
import api from "@/hooks/api";
import { createRedirectByRole } from "@/utils/redirectByRole";
import NavigationPortal from "@/components/layout/Navigation/NavigationPortal";

const entryName = "order";

const OrdersPage: NextPage = () => {
  const uuid = useId();
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);

  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  const { data: orderData, refetch } = api.order.useGetById(id);
  const { data: productsData } = api.order.useGetRelatedProducts(id);
  const { data: spreadsheetsData } = api.order.useGetRelatedSpreadsheets(id);

  const isLoaded = useLoaded();

  const { mutateAsync: update } = trpc.order.update.useMutation({
    onSuccess: () => {
      refetch().catch((err) => console.log(err));
    },
  });

  const apiUpdate = (key: Key, val: any) => {
    setStatus("loading");
    if (!isLoaded) return;
    if (!orderData) return;

    update({ id: orderData.id, [key]: val }).catch(console.log);
  };
  const { mutateAsync: createSpreadsheetMutation } =
    trpc.spreadsheet.create.useMutation({});

  const { mutateAsync: deleteSpreadsheetMutation } =
    trpc.spreadsheet.deleteById.useMutation({});

  // const { mutateAsync: createDesignMutation } = trpc.design.create.useMutation(
  //   {},
  // );
  const t = useTranslation();

  const [status, setStatus] = useState<
    "loading" | "idle" | "error" | "success"
  >("idle");

  const childrenMetadata = [
    { label: "Właściwości", icon: IconNotebook },
    { label: "Kontakt", icon: IconAddressBook },
    { label: "Produkcja", icon: IconBuildingFactory2 },
    { label: "E-maile", icon: IconMail },
    ...(spreadsheetsData
      ? spreadsheetsData.map((sheet, index) => ({
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
  const actionFill = (
    table: UniversalMatrix,
    metaId: number,
  ): [UniversalMatrix, string, any, any] => {
    if (table[0]?.[0] === undefined) {
      throw new Error(
        "UniversalMatrix is required to contain at least 1 element",
      );
    }
    const row_len = table[0]?.length;
    for (const row of table) {
      if (row.length !== row_len) {
        throw new Error(
          "UniversalMatrix is required to have rows of equal length",
        );
      }
    }
    let pusta = true;
    table_break: for (let y = 0; y < table.length; y++) {
      for (let x = 0; x < table[0]?.length; x++) {
        if (!(!table[y]?.[x] || (table[y]?.[x] && !table[y]?.[x]?.value))) {
          pusta = false;
          break table_break;
        }
      }
    }

    if (pusta) {
      const new_table: UniversalMatrix = [];
      const product = (productsData?.filter((val) => val.id === metaId) || [
        null,
      ])[0];
      const sizes = product?.sizes ?? [];
      const colors = product?.colors ?? [];

      for (let y = 0; y < colors.length + 1; y++) {
        new_table.push([]);
        for (let x = 0; x < sizes.length + 1; x++) {
          if (y > 0 && x === 0) {
            new_table[y]?.push({
              value: getColorNameFromHex(colors[y - 1] ?? ""),
              metaId,
              metaPropertyId: 0,
            });
          } else if (y === 0 && x > 0) {
            new_table[y]?.push({
              value: sizes[x - 1],
              metaId,
              metaPropertyId: 1,
            });
          } else {
            new_table[y]?.push({ value: "" });
          }
        }
      }

      const title_row = new_table[0]?.map((_val, index) =>
        index === 0 ? ({ value: product?.name } as UniversalCell) : undefined,
      );

      if (title_row !== undefined) {
        // @ts-ignore It is array
        new_table.insert(0, title_row);
      }

      return [
        new_table,
        "Auto uzupełnienie się powiodło.",
        undefined,
        undefined,
      ];
    }
    return [
      table,
      "error: Tablica musi być pusta do operacji auto uzupełniania.",
      undefined,
      undefined,
    ];
  };

  const addSpreadsheet = () => {
    createSpreadsheetMutation({
      name: `${t.sheet} ${(orderData?.spreadsheets?.length ?? 0) + 1}`,
      data: [
        [{}, {}],
        [{}, {}],
      ],
      orderId: id ?? undefined,
    })
      .then(() => router.reload())
      .catch(console.log);
  };

  const removeSpreadsheet = (id: number) => {
    deleteSpreadsheetMutation(id)
      .then(() => router.reload())
      .catch(console.log);
  };

  // const addDesign = () => {
  //   createDesignMutation({
  //     name: `${t.design} ${(orderData?.designs?.length ?? 0) + 1}`,
  //     data: [],
  //     orderId: id ?? undefined,
  //   })
  //     .then(() => router.reload())
  //     .catch(console.log);
  // };

  return (
    <>
      <NavigationPortal>
        <div className="flex grow flex-col p-4">
          <OrderList
            selectedId={id}
            onAddElement={() => setOpenAddModal(true)}
          />
        </div>
      </NavigationPortal>
      <Workspace
        childrenMetadata={
          id !== null
            ? [
                ...childrenMetadata,
                {
                  label: "",
                  icon: IconPlus,
                  props: {
                    onClick: addSpreadsheet,
                    className: "p-2",
                    onContextMenu: () => {},
                    onMiddleClick: () => {},
                  },
                },
              ]
            : []
        }
        onChange={() => {
          void refetch();
        }}
      >
        {id !== null && (
          <div className="relative flex flex-col gap-4 p-4">
            <OrderEditable id={id} key={`${uuid}order:${id}`} />
          </div>
        )}

        <OrderCustomerView
          orderData={orderData}
          orderApiUpdate={apiUpdate}
          refetch={() => {
            void refetch();
          }}
        />
        <OrderProductionView
          orderData={orderData}
          orderApiUpdate={apiUpdate}
          refetch={() => {
            void refetch();
          }}
        />
        {orderData && (
          <div className="relative p-4">
            <OrderMessagesView orderId={orderData.id} />
          </div>
        )}
        {spreadsheetsData?.map((val, index) => (
          <div key={`${uuid}spreadsheet:${index}:`}>
            <div className="flex justify-between gap-2 p-2 align-middle text-xl">
              <span>{val.name}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <IconDotsVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => removeSpreadsheet(val.id)}>
                    <IconTrashX /> {t.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Spreadsheet
              id={val.id}
              metadata={metadata}
              metadataVisuals={[
                { icon: IconColorSwatch, label: "Color" },
                { icon: IconRuler2, label: "Size" },
              ]}
              metadataActions={[
                {
                  icon: IconRobot,
                  label: "Auto uzupełnij",
                  action: actionFill,
                },
                {
                  icon: IconCheck,
                  label: "Sprawdź poprawność pól",
                  action: verifyMetadata,
                },
              ]}
            />
          </div>
        ))}

        {/* {orderData &&
          orderData.designs.map((val, index) => (
            <Design
              key={`${uuid}design:${index}:`}
              id={val.id}
              backgrounds={designBackgrounds}
              files={orderData.files}
            />
          ))} */}
      </Workspace>
      <OrderAddModal
        opened={openAddModal}
        onClose={(id?: number) => {
          setOpenAddModal(false);
          id !== undefined && void router.push(`/erp/order/${id}`);
        }}
      />
    </>
  );
};

export const getServerSideProps = createRedirectByRole("employee");

export default OrdersPage;
