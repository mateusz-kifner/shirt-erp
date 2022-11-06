import { useRouter } from "next/router"
import { useTranslation } from "../../../i18n"
import ApiList from "../../../components/api/ApiList"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import { capitalize } from "lodash"

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
        entryName ? capitalize(t(`${entryName}.plural` as any)) : undefined
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
