import { useId, useState } from "react";

// import * as XLSX from "xlsx"
import Design from "@/components/Design/Design";
import Spreadsheet from "@/components/Spreadsheet/Spreadsheet";
import { type UniversalMatrix } from "@/components/Spreadsheet/useSpreadSheetData";
import verifyMetadata from "@/components/Spreadsheet/verifyMetadata";
import { getColorNameFromHex } from "@/components/editable/EditableColor";
import Workspace from "@/components/layout/Workspace";
import Button from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useIsMobile } from "@/hooks/useIsMobile";
import useTranslation from "@/hooks/useTranslation";
import OrderArchivesList from "@/page-components/erp/order-archive/OrderArchivesList";
import OrderArchiveEditable from "@/page-components/erp/order-archive/OrderEditable";
import OrderAddModal from "@/page-components/erp/order/OrderAddModal";
import OrderMessagesView from "@/page-components/erp/order/OrderMessagesView";
import designBackgrounds from "@/page-components/erp/order/designBackgrounds";
import { api } from "@/utils/api";
import { getQueryAsIntOrNull } from "@/utils/query";
import {
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
import { type NextPage } from "next";
import { useRouter } from "next/router";

const entryName = "order-archive";

const OrderArchivesPage: NextPage = () => {
  const uuid = useId();
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");
  const { data: orderData } = api["order-archive"].getById.useQuery(
    id as number,
    {
      enabled: id !== null,
    },
  );

  const { mutateAsync: createSpreadsheetMutation } =
    api.spreadsheet.create.useMutation({});

  const { mutateAsync: deleteSpreadsheetMutation } =
    api.spreadsheet.deleteById.useMutation({});

  const { mutateAsync: createDesignMutation } = api.design.create.useMutation(
    {},
  );
  const t = useTranslation();

  const [status, setStatus] = useState<
    "loading" | "idle" | "error" | "success"
  >("idle");

  const childrenMetadata = [
    { label: "Właściwości", icon: IconNotebook },
    { label: "E-maile", icon: IconMail },
    ...(orderData && Array.isArray(orderData?.spreadsheets)
      ? orderData.spreadsheets.map((sheet, index) => ({
          label: sheet.name ?? `[${t.sheet}]`,
          icon: IconTable,
        }))
      : []),
  ];

  const apiUpdate = (key: string, val: any) => {
    setStatus("loading");
    // update({ [key]: val } as Partial<OrderType>)
    //   .then((val: any) => {
    //     setStatus("success")
    //   })
    //   .catch((err: any) => {
    //     setStatus("error")
    //   })
  };

  console.log(orderData?.products);
  const metadata = orderData
    ? orderData?.products?.reduce(
        (prev, next) => ({
          ...prev,
          [`${next.name}:${next.id}` ?? "[NAME NOT SET] " + next.id]: {
            id: next.id,
          },
        }),
        {},
      )
    : {};
  const actionFill = (
    table: UniversalMatrix,
    metaId: number,
  ): [UniversalMatrix, string, any, any] => {
    if (table[0]![0] === undefined) {
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
    table: for (let y = 0; y < table.length; y++) {
      for (let x = 0; x < table[0]!.length; x++) {
        if (!(!table[y]![x] || (table[y]![x] && !table[y]![x]?.value))) {
          pusta = false;
          break table;
        }
      }
    }

    if (pusta) {
      let new_table: UniversalMatrix = [];
      const product = (orderData?.products.filter(
        (val) => val.id === metaId,
      ) || [null])[0];
      const sizes = product?.sizes ?? [];
      const colors = product?.colors ?? [];

      for (let y = 0; y < colors.length + 1; y++) {
        new_table.push([]);
        for (let x = 0; x < sizes.length + 1; x++) {
          if (y > 0 && x == 0) {
            new_table[y]!.push({
              value: getColorNameFromHex(colors[y - 1] ?? ""),
              metaId,
              metaPropertyId: 0,
            });
          } else if (y == 0 && x > 0) {
            new_table[y]!.push({
              value: sizes[x - 1],
              metaId,
              metaPropertyId: 1,
            });
          } else {
            new_table[y]!.push({ value: "" });
          }
        }
      }

      new_table = [
        new_table[0]!.map((val, index) =>
          index === 0 ? { value: product?.name } : undefined,
        ),

        ...new_table,
      ];

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

  const addDesign = () => {
    createDesignMutation({
      name: `${t.design} ${(orderData?.designs?.length ?? 0) + 1}`,
      data: [],
      orderId: id ?? undefined,
    })
      .then(() => router.reload())
      .catch(console.log);
  };

  return (
    <>
      <Workspace
        cacheKey={entryName}
        navigationMetadata={[{ label: "Lista zamówień", icon: IconList }]}
        childrenMetadata={
          id !== null
            ? [
                ...childrenMetadata,
                {
                  label: "",
                  icon: IconPlus,
                  props: { onClick: addSpreadsheet, className: "p-2" },
                },
              ]
            : []
        }
        navigation={
          <div className="relative p-4">
            <OrderArchivesList
              selectedId={id}
              onAddElement={() => setOpenAddModal(true)}
            />
          </div>
        }
      >
        {id !== null && (
          <div className="relative flex flex-col gap-4 p-4 ">
            <OrderArchiveEditable id={id} />
          </div>
        )}
        {orderData && (
          <div className="relative p-4">
            <OrderMessagesView order={orderData as any} />
          </div>
        )}
        {orderData &&
          orderData.spreadsheets.map((val, index) => (
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

        {orderData &&
          orderData.designs.map((val, index) => (
            <Design
              key={`${uuid}design:${index}:`}
              id={val.id}
              backgrounds={designBackgrounds}
              files={orderData.files}
            />
          ))}
      </Workspace>
      <OrderAddModal
        opened={openAddModal}
        onClose={(id?: number) => {
          setOpenAddModal(false);
          id !== undefined &&
            router.push(`/erp/order/${id}`).catch((e) => {
              throw e;
            });
        }}
      />
    </>
  );
};

export default OrderArchivesPage;