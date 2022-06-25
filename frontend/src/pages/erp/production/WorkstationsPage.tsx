import { FC } from "react"

import template from "../../../models/workstation.model.json"
import DefaultPage from "../../../components/DefaultPage"
import ProductionNavigation from "./ProductionNavigation"
import { makeDefaultListItem } from "../../../components/DefaultListItem"

const workstationsPage: FC = () => {
  return (
    <>
      <ProductionNavigation />
      <DefaultPage
        template={template}
        ListElement={makeDefaultListItem("name")}
        entryName="workstations"
      />
    </>
  )
}

export default workstationsPage
