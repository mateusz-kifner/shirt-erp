import { FC } from "react"
import template from "../../../data/models/procedure.template.json"
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
