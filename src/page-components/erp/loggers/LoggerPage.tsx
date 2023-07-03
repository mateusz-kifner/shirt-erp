import template from "../../../models/log.model.json"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import DefaultPage from "../../../components/DefaultPage"

const LoggerPage = () => {
  return (
    <DefaultPage
      template={template}
      entryName="logs"
      ListElement={makeDefaultListItem("message")}
    />
  )
}

export default LoggerPage
