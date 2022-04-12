import { FC, useRef, useState } from "react"
import SplitPane from "react-split-pane"

import ProductDetails from "./ProductDetails"
import ProductsList, { ProductsListHandle } from "./ProductsList"

import styles from "../../components/SplitPaneWithSnap.module.css"

export const product_template: any = {
  id: {
    label: "id",
    type: "id",
  },
  name: {
    label: "Nazwa",
    type: "string",
    initialValue: "",
    required: true,
  },
  codeName: {
    label: "Kod produktu",
    type: "string",
    initialValue: "",
  },
  category: {
    label: "Kategoria",
    type: "enum",
    initialValue: "koszulka",
    enum_data: [
      "koszulka",
      "bluza",
      "czapka",
      "torba / worek",
      "kamizelka",
      "kubek",
      "inne",
    ],
  },
  desc: {
    label: "Opis",
    type: "string",
    initialValue: "",
  },
  color: {
    label: "Kolor",
    type: "color",
  },
  icon: {
    label: "Ikona",
    type: "image",
  },
  previewImg: {
    label: "Zdjęcia",
    type: "image",
  },
  createdAt: {
    label: "Utworzono",
    type: "datetime",
    disabled: true,
  },
  updatedAt: {
    label: "Edytowano",
    type: "datetime",
    disabled: true,
  },
}

const ProductsPage: FC = () => {
  const [productId, setProductId] = useState<number | undefined>()
  const productListRef = useRef<ProductsListHandle>(null)
  return (
    <SplitPane
      split="vertical"
      minSize={180}
      defaultSize={480}
      className={styles.splitpane}
    >
      <div className={styles.pre_pane}>
        <div className={styles.pane}>
          <ProductsList
            ref={productListRef}
            onItemClickId={setProductId}
            template={product_template}
          />
        </div>
      </div>
      <div className={styles.pre_pane}>
        <div className={styles.pane}>
          <ProductDetails
            productId={productId}
            template={product_template}
            onUpdate={productListRef.current?.refetch}
          />
        </div>
      </div>
    </SplitPane>
  )
}

export default ProductsPage
