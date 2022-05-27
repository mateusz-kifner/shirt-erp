import { FC } from "react"
import schema from "../../../schemas/procedure.schema.json"
import DefaultPage from "../../../components/DefaultPage"
import ProductionNavigation from "./ProductionNavigation"
import { makeDefaultListItem } from "../../../components/DefaultListItem"

const ProductsPage: FC = () => {
  return (
    <>
      <ProductionNavigation initialTab={1} />
      <DefaultPage
        schema={schema}
        entryName="procedures"
        ListElement={makeDefaultListItem("name")}
      />
    </>
  )
}

export default ProductsPage
