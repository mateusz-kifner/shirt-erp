import { FC } from "react"

import template from "../../templates/log.template.json"
import { makeDefaultListItem } from "../../components/DefaultListItem"
import DefaultPage from "../../components/DefaultPage"

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
