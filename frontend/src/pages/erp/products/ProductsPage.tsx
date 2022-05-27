import { FC } from "react"

import schema from "../../../schemas/product.schema.json"
import ProductListItem from "./ProductListItem"
import DefaultPage from "../../../components/DefaultPage"

const ProductsPage: FC = () => {
  return (
    <DefaultPage
      schema={schema}
      ListElement={ProductListItem}
      entryName="products"
    />
  )
}

export default ProductsPage
