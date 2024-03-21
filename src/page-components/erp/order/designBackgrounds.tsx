import type { DesignBackgroundsType } from "@/components/Design/DesignSSR";
import { IconShirt } from "@tabler/icons-react";

const designBackgrounds: DesignBackgroundsType = [
  {
    name: "Koszulka SVG",
    icon: IconShirt,
    images: [
      {
        name: "Przód",
        image: {
          url: "/assets/shirt-svgrepo-com.svg",
        },
        mask: {
          url: "/assets/shirt-mask-svgrepo-com.svg",
        },
      },
      {
        name: "Tył",
        image: {
          url: "/assets/shirt-back-svgrepo-com.svg",
        },
        mask: {
          url: "/assets/shirt-mask-svgrepo-com.svg",
        },
      },
    ],
  },
  {
    name: "Koszulka",
    icon: IconShirt,
    images: [
      {
        name: "Przód",
        image: {
          url: "/assets/White Tshirt - 1600x1571.png",
        },
        mask: {
          url: "/assets/White Tshirt - 1600x1571-mask.png",
        },
      },
      {
        name: "Tył",
        image: {
          url: "/assets/White Tshirt - 1600x1571-back.png",
        },
        mask: {
          url: "/assets/White Tshirt - 1600x1571-back-mask.png",
        },
      },
    ],
  },
];

export default designBackgrounds;
