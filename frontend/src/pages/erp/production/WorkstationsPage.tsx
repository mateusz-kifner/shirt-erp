import { FC } from "react"

import schema from "../../../schemas/workstation.schema.json"
import WorkstationListItem from "./WorkstationListItem"
import DefaultPage from "../../../components/DefaultPage"

const workstationsPage: FC = () => {
  return (
    <DefaultPage
      schema={schema}
      ListElement={WorkstationListItem}
      entryName="workstations"
    />
  )
}

export default workstationsPage
