import { useId, useState } from "react";

import template from "@/templates/order.template";
// import * as XLSX from "xlsx"
import ApiEntryEditable from "@/components/ApiEntryEditable";
import Design from "@/components/Design/Design";
import Spreadsheet from "@/components/Spreadsheet/Spreadsheet";
import { type UniversalMatrix } from "@/components/Spreadsheet/useSpreadSheetData";
import verifyMetadata from "@/components/Spreadsheet/verifyMetadata";
import { getColorNameFromHex } from "@/components/editable/EditableColor";
import { Tab } from "@/components/layout/MultiTabs";
import Workspace from "@/components/layout/Workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import useTranslation from "@/hooks/useTranslation";
import OrderAddModal from "@/page-components/erp/order/OrderAddModal";
import OrderList from "@/page-components/erp/order/OrderList";
import designBackgrounds from "@/page-components/erp/order/designBackgrounds";
import { api } from "@/utils/api";
import { getQueryAsIntOrNull } from "@/utils/query";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconCheck,
  IconColorSwatch,
  IconList,
  IconMail,
  IconNotebook,
  IconPlus,
  IconRobot,
  IconRuler2,
  IconTable,
  IconVector,
} from "@tabler/icons-react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
// import designBackgrounds from "./designBackgrounds"
// import OrderMessagesView from "./OrderMessagesView"

const entryName = "order";

const OrdersPage: NextPage = () => {
  const uuid = useId();
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)"
  );
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");
  const { data: orderData } = api.order.getById.useQuery(id as number, {
    enabled: id !== null,
  });

  const { mutateAsync: createSpreadsheetMutation } =
    api.spreadsheet.create.useMutation({});

  const { mutateAsync: createDesignMutation } = api.design.create.useMutation(
    {}
  );
  const t = useTranslation();
  // const { isSmall, hasTouch } = useAuthContext()
  // const isMobile = hasTouch || isSmall
  // const [openAddModal, setOpenAddModal] = useState<boolean>(false)

  // const router = useRouter()
  // const id = getQueryAsIntOrNull(router, "id")
  // const { data, update, refetch } = useStrapi<OrderType>(entryName, id, {
  //   query: "populate=*",
  // })
  const [status, setStatus] = useState<
    "loading" | "idle" | "error" | "success"
  >("idle");
  const childrenIcons = [
    IconList,
    IconNotebook,
    IconMail,
    ...((orderData &&
      orderData?.spreadsheets &&
      orderData?.spreadsheets.map(() => IconTable)) ??
      []),
    IconVector,
  ];

  const childrenLabels = id
    ? [
        "Lista zamówień",
        "Właściwości",
        "E-maile",
        ...(orderData && Array.isArray(orderData?.spreadsheets)
          ? orderData.spreadsheets.map(
              (sheet, index) => sheet.name ?? `[${t.sheet}]`
            )
          : []),
        ...(orderData && Array.isArray(orderData?.designs)
          ? orderData.designs.map(
              (design, index) => design.name ?? `[${t.design}]`
            )
          : []),
      ]
    : ["Lista zamówień"];

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
        {}
      )
    : {};
  const actionFill = (
    table: UniversalMatrix,
    metaId: number
  ): [UniversalMatrix, string, any, any] => {
    let pusta = true;
    table: for (let y = 0; y < table.length; y++) {
      for (let x = 0; x < table[0].length; x++) {
        if (!(!table[y][x] || (table[y][x] && !table[y][x]?.value))) {
          pusta = false;
          break table;
        }
      }
    }

    if (pusta) {
      let new_table: UniversalMatrix = [];
      const product = (orderData?.products.filter(
        (val) => val.id === metaId
      ) || [null])[0];
      const sizes = product?.sizes ?? [];
      const colors = product?.colors ?? [];

      for (let y = 0; y < colors.length + 1; y++) {
        new_table.push([]);
        for (let x = 0; x < sizes.length + 1; x++) {
          if (y > 0 && x == 0) {
            new_table[y].push({
              value: getColorNameFromHex(colors[y - 1]),
              metaId,
              metaPropertyId: 0,
            });
          } else if (y == 0 && x > 0) {
            new_table[y].push({
              value: sizes[x - 1],
              metaId,
              metaPropertyId: 1,
            });
          } else {
            new_table[y].push({ value: "" });
          }
        }
      }

      new_table = [
        new_table[0].map((val, index) =>
          index === 0 ? { value: product?.name } : undefined
        ),

        ...new_table,
      ];

      return [new_table, "Auto uzupełnienie się powiodło."];
    }
    return [
      table,
      "error: Tablica musi być pusta do operacji auto uzupełniania.",
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
    }).then(() => router.reload());
  };
  const addDesign = () => {
    createDesignMutation({
      name: `${t.design} ${(orderData?.designs?.length ?? 0) + 1}`,
      data: [],
      orderId: id ?? undefined,
    }).then(() => router.reload());
  };
  // const table_template = {
  //   name: {
  //     label: "Nazwa arkusza",
  //     type: "text",
  //   },
  //   table: {
  //     type: "table",
  //     metadataIcons: [IconColorSwatch, IconRuler2Measure],
  //     metadataLabels: ["Kolor", "Rozmiar"],
  //     metadata,
  //     metadataActions: [
  //       (table: UniversalMatrix, metaId: number) => {
  //         let pusta = true
  //         table: for (let y = 0; y < table.length; y++) {
  //           for (let x = 0; x < table[0].length; x++) {
  //             if (!(!table[y][x] || (table[y][x] && !table[y][x]?.value))) {
  //               pusta = false
  //               break table
  //             }
  //           }
  //         }

  //         if (pusta) {
  //           let new_table: UniversalMatrix = []
  //           const product = (data?.products.filter(
  //             (val) => val.id === metaId
  //           ) || [null])[0]
  //           const sizes = product?.variants?.sizes
  //           const colors = product?.variants?.colors

  //           for (let y = 0; y < colors.length + 1; y++) {
  //             new_table.push([])
  //             for (let x = 0; x < sizes.length + 1; x++) {
  //               if (y > 0 && x == 0) {
  //                 new_table[y].push({
  //                   value: getColorNameFromHex(colors[y - 1]),
  //                   metaId,
  //                   metaPropertyId: 0,
  //                 })
  //               } else if (y == 0 && x > 0) {
  //                 new_table[y].push({
  //                   value: sizes[x - 1],
  //                   metaId,
  //                   metaPropertyId: 1,
  //                 })
  //               } else {
  //                 new_table[y].push({ value: "" })
  //               }
  //             }
  //           }

  //           new_table = [
  //             new_table[0].map((val, index) =>
  //               index === 0 ? { value: product?.name } : undefined
  //             ),

  //             ...new_table,
  //           ]

  //           return [new_table, "Auto uzupełnienie się powiodło."]
  //         }
  //         return [
  //           table,
  //           "error: Tablica musi być pusta do operacji auto uzupełniania.",
  //         ]
  //       },
  //       verifyMetadata,
  //     ],
  //     metadataActionLabels: ["Auto uzupełnij", "Sprawdź poprawność pól"],
  //     metadataActionIcons: [IconRobot, IconCheck],
  //   },
  // }

  // const design_template = {
  //   name: {
  //     label: "Nazwa designu",
  //     type: "text",
  //   },
  //   design: {
  //     type: "design",
  //     files: data?.files,
  //     backgrounds: designBackgrounds,
  //   },
  // }

  // const onAddElement = (element: number) => {
  //   switch (element) {
  //     case 0:
  //       data &&
  //         update({
  //           id: data.id,
  //           tables: [
  //             ...(data.tables ?? []),
  //             {
  //               name: "Arkusz " + ((data.tables?.length ?? 0) + 1),
  //               table: [
  //                 [null, null],
  //                 [null, null],
  //               ],
  //             },
  //           ],
  //         })

  //       break
  //     case 1:
  //       data &&
  //         update({
  //           id: data.id,
  //           designs: [
  //             ...(data.designs ?? []),
  //             {
  //               name: "Design " + ((data.designs?.length ?? 0) + 1),
  //               design: {},
  //             },
  //           ],
  //         })
  //       break
  //   }
  // }

  // const addElementLabels = ["sheet", "design"]
  // const addElementIcons = [IconTable, IconVector]
  console.log(orderData?.spreadsheets);
  return (
    <>
      <Workspace
        cacheKey={entryName}
        childrenLabels={childrenLabels}
        childrenIcons={childrenIcons}
        defaultActive={id ? 1 : 0}
        defaultPinned={isMobile ? [] : id ? [0] : []}
        rightMenuSection={
          id !== null && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Tab value={-1}>
                  <IconPlus />
                </Tab>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={addSpreadsheet}>
                  <IconTable />
                  {t.sheet}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={addDesign}>
                  <IconVector />
                  {t.design}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      >
        <div className="relative p-4">
          <OrderList
            selectedId={id}
            onAddElement={() => setOpenAddModal(true)}
          />
        </div>
        <div className="relative p-4">
          <ApiEntryEditable
            template={template}
            entryName={entryName}
            id={id}
            allowDelete
          />
        </div>
        <div className="relative p-4">
          <div>{/*MAILS HERE*/}TODO: Add mails here</div>
        </div>
        {orderData &&
          orderData.spreadsheets.map((val, index) => (
            <Spreadsheet
              key={`${uuid}spreadsheet:${index}:`}
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
          ))}

        {orderData &&
          orderData.designs.map((val, index) => (
            <Design
              key={`${uuid}design:${index}:`}
              id={val.id}
              backgrounds={designBackgrounds}
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

export default OrdersPage;
