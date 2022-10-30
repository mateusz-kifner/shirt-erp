import ApiList from "../../../components/api/ApiList"

import _ from "lodash"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import EmailMessageListItem from "./EmailMessageListItem"

const entryName = "email-client/messages"

interface EmailMessagesProps {
  selectedId: number | null
}

const EmailMessagesList = ({ selectedId }: EmailMessagesProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <ApiList
      ListItem={EmailMessageListItem}
      entryName={entryName}
      label={
        entryName ? _.capitalize(t(`${entryName}.plural` as any)) : undefined
      }
      selectedId={selectedId}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      filterKeys={["subject", "from", "text", "to"]}
    />
  )
}

export default EmailMessagesList
