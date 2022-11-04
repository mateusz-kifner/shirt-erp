import { Shirt } from "tabler-icons-react"
import { DesignBackgroundsType } from "../../../components/editable/EditableDesignSSR"

const designBackgrounds: DesignBackgroundsType = [
  {
    name: "Koszulka SVG",
    icon: Shirt,
    images: [
      {
        name: "Przód",
        image: {
          name: "Przód",
          ext: ".svg",
          url: "/assets/shirt-svgrepo-com.svg",
        },
        mask: {
          name: "Mask",
          ext: ".svg",
          url: "/assets/shirt-mask-svgrepo-com.svg",
        },
      },
      {
        name: "Tył",
        image: {
          name: "Tył",
          ext: ".svg",
          url: "/assets/shirt-back-svgrepo-com.svg",
        },
        mask: {
          name: "Mask",
          ext: ".svg",
          url: "/assets/shirt-mask-svgrepo-com.svg",
        },
      },
    ],
  },
  {
    name: "Koszulka",
    icon: Shirt,
    images: [
      {
        name: "Przód",
        image: {
          name: "Przód",
          ext: ".png",
          url: "/assets/White Tshirt - 1600x1571.png",
        },
        mask: {
          name: "Mask",
          ext: ".png",
          url: "/assets/White Tshirt - 1600x1571-mask.png",
        },
      },
      {
        name: "Tył",
        image: {
          name: "Tył",
          ext: ".svg",
          url: "/assets/White Tshirt - 1600x1571-back.png",
        },
        mask: {
          name: "Mask",
          ext: ".svg",
          url: "/assets/White Tshirt - 1600x1571-back-mask.png",
        },
      },
    ],
  },
]

export default designBackgrounds
