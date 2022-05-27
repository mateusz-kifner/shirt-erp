import { FC } from "react"

import schema from "../../../schemas/log.schema.json"
import DefaultPage from "../../../components/DefaultPage"
import { makeDefaultListItem } from "../../../components/DefaultListItem"

const LoggerPage: FC = () => {
  return (
    <DefaultPage
      schema={schema}
      entryName="logs"
      ListElement={makeDefaultListItem("message")}
    />
  )
}

export default LoggerPage
