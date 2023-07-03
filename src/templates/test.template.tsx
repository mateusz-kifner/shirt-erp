import { IconBug } from "@tabler/icons-react";

const testTemplate = {
  id: { type: "id" },

  name: {
    label: "Napis",
    type: "text",
    initialValue: "test",
    leftSection: <IconBug />,
    rightSection: <IconBug />,
  },
  number: {
    label: "number",
    type: "number",
    leftSection: <IconBug />,
    rightSection: <IconBug />,
  },
  money: {
    label: "money",
    type: "money",
    leftSection: <IconBug />,
    rightSection: <IconBug />,
  },

  // bool: {
  //   label: "checkbox",
  //   type: "boolean",
  //   initialValue: false,
  //   checkbox: true,
  // },
  // switch: {
  //   label: "switch",
  //   type: "boolean",
  //   initialValue: false,
  // },
  category: {
    label: "Enum",
    type: "enum",
    initialValue: "option 1",
    enum_data: ["option 1", "option 2", "option 3"],
    collapce: true,
  },
  // color: {
  //   label: "Kolor",
  //   type: "color",
  //   initialValue: { name: "Red", hex: "#ff0000" },
  //   showText: true,
  // },
  date: {
    label: "Date",
    type: "date",
    initialValue: "2021-11-05T12:24:05.097Z",
  },
  datetime: {
    label: "Datetime",
    type: "datetime",
    initialValue: "2021-11-05T12:24:05.097Z",
    collapse: true,
  },
  // product: {
  //   label: "product",
  //   type: "apiEntry",
  //   entryName: "product",
  // },
  client: {
    label: "client",
    type: "apiEntry",
    entryName: "client",
  },
  // productComponent: {
  //   label: "productComponent",
  //   type: "productComponent",
  //   initialValue: [],
  // },
  // productComponents: {
  //   label: "productComponents",
  //   type: "productComponents",
  //   initialValue: [],
  // },

  // image: {
  //   label: "Image",
  //   type: "image",
  //   initialValue: null,
  // },
  // file: {
  //   label: "File",
  //   type: "file",

  //   initialValue: {
  //     id: 40,
  //     name: "test7.png",
  //     alternativeText: null,
  //     caption: null,
  //     width: 1920,
  //     height: 1080,
  //     formats: {
  //       large: {
  //         ext: ".png",
  //         url: "/uploads/large_test7_d10bd369ae.png",
  //         hash: "large_test7_d10bd369ae",
  //         mime: "image/png",
  //         name: "large_test7.png",
  //         path: null,
  //         size: 198.86,
  //         width: 1000,
  //         height: 563,
  //       },
  //       small: {
  //         ext: ".png",
  //         url: "/uploads/small_test7_d10bd369ae.png",
  //         hash: "small_test7_d10bd369ae",
  //         mime: "image/png",
  //         name: "small_test7.png",
  //         path: null,
  //         size: 68.33,
  //         width: 500,
  //         height: 281,
  //       },
  //       medium: {
  //         ext: ".png",
  //         url: "/uploads/medium_test7_d10bd369ae.png",
  //         hash: "medium_test7_d10bd369ae",
  //         mime: "image/png",
  //         name: "medium_test7.png",
  //         path: null,
  //         size: 126.47,
  //         width: 750,
  //         height: 422,
  //       },
  //       thumbnail: {
  //         ext: ".png",
  //         url: "/uploads/thumbnail_test7_d10bd369ae.png",
  //         hash: "thumbnail_test7_d10bd369ae",
  //         mime: "image/png",
  //         name: "thumbnail_test7.png",
  //         path: null,
  //         size: 24.04,
  //         width: 245,
  //         height: 138,
  //       },
  //     },
  //     hash: "test7_d10bd369ae",
  //     ext: ".png",
  //     mime: "image/png",
  //     size: 355.94,
  //     url: "/uploads/test7_d10bd369ae.png",
  //     previewUrl: null,
  //     provider: "local",
  //     provider_metadata: null,
  //     createdAt: "2021-12-02T21:46:47.894Z",
  //     updatedAt: "2021-12-02T21:46:47.894Z",
  //     related: [{}],
  //   },
  // },
  // files: {
  //   label: "Files",
  //   type: "files",
  // },
  // clientIds: {
  //   label: "clientIds",
  //   type: "array",
  //   arrayType: "apiEntryId",
  //   entryName: "clients",
  // },
  // employee: {
  //   label: "User",
  //   type: "apiEntry",
  //   entryName: "users",
  // },
  // employees: {
  //   label: "Users",
  //   type: "array",
  //   arrayType: "apiEntry",
  //   entryName: "users",
  // },
  // submit: {
  //   label: "Submit",
  //   type: "submit",
  // },
  // arrayText: {
  //   label: "Array Text",
  //   type: "array",
  //   arrayType: "text",
  //   maxCount: 10,
  // },
  // group: {
  //   label: "Grupa",
  //   type: "group",
  //   template: {
  //     name: {
  //       type: "text",
  //       label: "imie",
  //     },
  //     color: {
  //       type: "color",
  //       label: "Kolor",
  //     },
  //   },
  // },
  // group2: {
  //   label: "Grupa 2",
  //   type: "group",
  //   style: { flexDirection: "column" },
  //   template: {
  //     name: {
  //       type: "text",
  //       label: "imie",
  //     },
  //     color: {
  //       type: "color",
  //       label: "Kolor",
  //     },
  //   },
  // },
  // group3: {
  //   label: "Grupa 2",
  //   type: "group",
  //   style: { flexDirection: "column" },
  //   template: {
  //     name: {
  //       type: "apiEntry",
  //       label: "User",
  //       entryName: "users",
  //     },
  //     color: {
  //       type: "color",
  //       label: "Kolor",
  //     },
  //   },
  // },
  // group_of_arrays: {
  //   label: "group of arrays",
  //   type: "group",
  //   template: {
  //     arrayText: {
  //       label: "Array Text",
  //       type: "array",
  //       arrayType: "text",
  //       maxCount: 10,
  //     },
  //     arrayText2: {
  //       label: "Array Text",
  //       type: "array",
  //       arrayType: "text",
  //       maxCount: 10,
  //     },
  //   },
  // },
};

export default testTemplate;
