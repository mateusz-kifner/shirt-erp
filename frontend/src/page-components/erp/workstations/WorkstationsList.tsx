import { useRouter } from "next/router"
import { useTranslation } from "../../../i18n"
import ApiList from "../../../components/api/ApiList"
import WorkstationListItem from "./WorkstationListItem"
import { capitalize } from "lodash"

const entryName = "workstations"

interface WorkstationsListProps {
  selectedId: number | null
  onAddElement?: () => void
}

const WorkstationsList = (props: WorkstationsListProps) => {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <ApiList
      ListItem={WorkstationListItem}
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

export default WorkstationsList
