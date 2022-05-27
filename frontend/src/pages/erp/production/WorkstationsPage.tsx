import { FC } from "react"

import schema from "../../../schemas/workstation.schema.json"
import DefaultPage from "../../../components/DefaultPage"
import ProductionNavigation from "./ProductionNavigation"
import { makeDefaultListItem } from "../../../components/DefaultListItem"

const workstationsPage: FC = () => {
  return (
    <>
      <ProductionNavigation />
      <DefaultPage
        schema={schema}
        ListElement={makeDefaultListItem("name")}
        entryName="workstations"
      />
    </>
  )
}

export default workstationsPage
