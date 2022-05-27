import { FC } from "react"

import schema from "../../../schemas/workstation.schema.json"
import WorkstationListItem from "./WorkstationListItem"
import DefaultPage from "../../../components/DefaultPage"
import ProductionNavigation from "./ProductionNavigation"

const workstationsPage: FC = () => {
  return (
    <>
      <ProductionNavigation />
      <DefaultPage
        schema={schema}
        ListElement={WorkstationListItem}
        entryName="workstations"
      />
    </>
  )
}

export default workstationsPage
