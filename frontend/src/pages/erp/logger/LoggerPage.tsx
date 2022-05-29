import { FC } from "react"

import template from "../../../model-templates/log.template.json"
import DefaultPage from "../../../components/DefaultPage"
import { makeDefaultListItem } from "../../../components/DefaultListItem"

const LoggerPage: FC = () => {
  return (
    <DefaultPage
      template={template}
      entryName="logs"
      ListElement={makeDefaultListItem("message")}
    />
  )
}

export default LoggerPage
