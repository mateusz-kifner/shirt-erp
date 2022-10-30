import _ from "lodash"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import ApiList from "../../../components/api/ApiList"
import { makeDefaultListItem } from "../../../components/DefaultListItem"

const entryName = "procedures"

interface ProceduresListProps {
  selectedId: number | null
  onAddElement?: () => void
}

const ProceduresList = (props: ProceduresListProps) => {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <ApiList
      ListItem={makeDefaultListItem("name")}
      entryName={entryName}
      label={
        entryName ? _.capitalize(t(`${entryName}.plural` as any)) : undefined
      }
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      {...props}
      showAddButton
    />
  )
}

export default ProceduresList
