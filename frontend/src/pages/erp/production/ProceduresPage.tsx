import { FC } from "react"
import template from "../../../models/procedure.model.json"
import DefaultPage from "../../../components/DefaultPage"
import ProductionNavigation from "./ProductionNavigation"
import { makeDefaultListItem } from "../../../components/DefaultListItem"

const ProductsPage: FC = () => {
  return (
    <>
      <ProductionNavigation initialTab={1} />
      <DefaultPage
        template={template}
        entryName="procedures"
        ListElement={makeDefaultListItem("name")}
      />
    </>
  )
}

export default ProductsPage
