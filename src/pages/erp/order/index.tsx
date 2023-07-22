import { useId, useState } from "react";

import template from "@/templates/order.template";
// import * as XLSX from "xlsx"
// import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
// import Workspace from "../../../components/layout/Workspace"
// import OrdersList from "./OrdersList"
// import { NextPage } from "next"
// import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
// import OrderAddModal from "./OrderAddModal"
// import useStrapi from "../../../hooks/useStrapi"
// import { OrderType } from "../../../types/OrderType"
// import Editable from "../../../components/editable/Editable"
import ApiEntryEditable from "@/components/ApiEntryEditable";
import Spreadsheet from "@/components/Spreadsheet/Spreadsheet";
import { UniversalMatrix } from "@/components/Spreadsheet/useSpreadSheetData";
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
  IconRuler,
  IconTable,
  IconVector,
} from "@tabler/icons-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
// import { Button, Group, Menu, Stack, Text } from "@mantine/core"
// import DeleteButton from "../../../components/DeleteButton"
// import { useTranslation } from "../../../i18n"
// import { UniversalMatrix } from "../../../components/spreadsheet/useSpreadSheetData"
// import { getColorNameFromHex } from "../../../components/editable/EditableColor"
// import verifyMetadata from "../../../components/spreadsheet/verifyMetadata"
// import designBackgrounds from "./designBackgrounds"
// import { useRouter } from "next/router"
// import { Tab } from "../../../components/layout/MultiTabs"
// import { useAuthContext } from "../../../context/authContext"
// import OrderMessagesView from "./OrderMessagesView"
// import axios from "axios"

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

  const { mutate: createSpreadsheetMutation } =
    api.spreadsheet.create.useMutation({});

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

  const metadata = orderData
    ? orderData?.products?.reduce(
        (prev, next) => ({
          ...prev,
          [next.name ?? "[NAME NOT SET] " + next.id]: { id: next.id },
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
      const product = (data?.products.filter((val) => val.id === metaId) || [
        null,
      ])[0];
      const sizes = product?.variants?.sizes;
      const colors = product?.variants?.colors;

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
    });
  };
  const addDesign = () => {};
  // const table_template = {
  //   name: {
  //     label: "Nazwa arkusza",
  //     type: "text",
  //   },
  //   table: {
  //     type: "table",
  //     metadataIcons: [IconColorSwatch, IconRulerMeasure],
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Tab value={-1}>
                <IconPlus />
              </Tab>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => addSpreadsheet()}>
                <IconTable />
                {t.sheet}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addDesign()}>
                <IconVector />
                {t.design}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <OrderList selectedId={id} onAddElement={() => setOpenAddModal(true)} />
        <ApiEntryEditable
          template={template}
          entryName={entryName}
          id={id}
          allowDelete
        />
        <div>{/*MAILS HERE*/}</div>
        {orderData &&
          orderData.spreadsheets.map((val, index) => (
            <Spreadsheet
              key={`${uuid}spreadsheet:${index}:`}
              id={val.id}
              metadata={metadata}
              metadataVisuals={[
                { icon: IconColorSwatch, label: "Color" },
                { icon: IconRuler, label: "Size" },
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
      </Workspace>
      {/*
      <Workspace
        childrenLabels={childrenLabels}
        childrenIcons={childrenIcons}
        rightMenuSection={
          id !== null && (
            <Menu position="bottom" withArrow withinPortal>
              <Menu.Target>
                <Tab
                  Icon={IconPlus}
                  value={childrenLabels.length}
                  p="xs"
                  variant="outline"
                >
                  {isMobile ? t("add") : ""}
                </Tab>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item py={4}>
                  <Text color="grey" size="xs">
                    {t("close")}
                  </Text>
                </Menu.Item>
                {addElementLabels.map((label, index) => {
                  const Icon = addElementIcons?.[index]
                    ? addElementIcons[index]
                    : IconPlus
                  return (
                    <Menu.Item
                      key={uuid + "_menu_" + index}
                      icon={<Icon size={18} />}
                      onClick={() => onAddElement?.(index)}
                    >
                      {t(label as any)}
                    </Menu.Item>
                  )
                })}
              </Menu.Dropdown>
            </Menu>
          )
        }
      >
        <OrdersList
          selectedId={id}
          onAddElement={() => setOpenAddModal(true)}
        />

        <Stack>
          <ApiEntryEditable
            template={template}
            entryName={"orders"}
            id={id}
            allowDelete
          />
          {!!id && (
            <Button
              style={{ position: "relative", bottom: "96px" }}
              onClick={() =>
                axios
                  .get("/order/archive/" + id)
                  .then((res) => {
                    router.push(`/erp/orders`)
                  })
                  .catch((err) => console.log(err))
              }
              variant={"light"}
              color="orange"
            >
              {t("archive")}
            </Button>
          )}
        </Stack>
        <OrderMessagesView order={data} refetch={refetch} />

        {data &&
          Array.isArray(data?.tables) &&
          data.tables.map((table, index) => {
            // console.log(table)
            return (
              table && (
                <div key={uuid + index}>
                  <Stack style={{ minHeight: 200 }}>
                    <Editable
                      template={table_template}
                      data={table}
                      onSubmit={(key, value) => {
                        console.log("onSubmit table [", key, "]: ", value)
                        apiUpdate(
                          "tables",
                          data.tables.map((originalVal, originalIndex) =>
                            index === originalIndex
                              ? { ...originalVal, [key]: value }
                              : originalVal
                          )
                        )
                      }}
                    />{" "}
                  </Stack>
                  <Group></Group>
                  <DeleteButton
                    label="sheet"
                    onDelete={() =>
                      update({
                        id: data.id,
                        tables: data.tables.filter((val, i) => i !== index),
                      })
                    }
                    buttonProps={{ mt: "4rem" }}
                  />
                </div>
              )
            )
          })}
        {data &&
          Array.isArray(data?.designs) &&
          data.designs.map((design, index) => {
            // console.log(table)
            return (
              design && (
                <div key={uuid + index}>
                  <Stack style={{ minHeight: 200 }}>
                    <Editable
                      template={design_template}
                      data={design}
                      onSubmit={(key, value) => {
                        console.log("onSubmit design [", key, "]: ", value)
                        apiUpdate(
                          "design",
                          data.designs.map((originalVal, originalIndex) =>
                            index === originalIndex
                              ? { ...originalVal, [key]: value }
                              : originalVal
                          )
                        )
                      }}
                    />{" "}
                  </Stack>
                  <Group></Group>
                  <DeleteButton
                    label="design"
                    onDelete={() =>
                      update({
                        id: data.id,
                        designs: data.designs.filter((val, i) => i !== index),
                      })
                    }
                    buttonProps={{ mt: "4rem" }}
                  />
                </div>
              )
            )
          })}
      </Workspace> */}
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
