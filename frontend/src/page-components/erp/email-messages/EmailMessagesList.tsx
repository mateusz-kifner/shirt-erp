import ApiList from "../../../components/api/ApiList"

import { useRouter } from "next/router"
import { useTranslation } from "../../../i18n"
import EmailMessageListItem from "./EmailMessageListItem"
import { capitalize } from "lodash"

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
        entryName ? capitalize(t(`${entryName}.plural` as any)) : undefined
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
