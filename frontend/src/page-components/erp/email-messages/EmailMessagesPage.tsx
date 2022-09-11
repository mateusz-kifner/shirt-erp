import _ from "lodash"
import { useRouter } from "next/router"
import Workspace from "../../../components/layout/Workspace"
import { EmailProvider } from "../../../context/emailContext"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import EmailMessagesList from "./EmailMessagesList"
import EmailMessagesView from "./EmailMessageView"

const entryName = "email-messages"

const EmailMessagesPage = () => {
  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")
  const currentView = id ? [0, 1] : 0

  return (
    <EmailProvider>
      <Workspace
        childrenLabels={["Lista email", "Treść"]}
        defaultViews={currentView}
      >
        <EmailMessagesList selectedId={id} />
        <EmailMessagesView id={id} />
      </Workspace>
    </EmailProvider>
  )
}

export default EmailMessagesPage
