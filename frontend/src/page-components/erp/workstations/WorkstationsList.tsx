import _ from "lodash"
import { useRouter } from "next/router"
import ApiList from "../../../components/api/ApiList"
import names from "../../../models/names.json"
import WorkstationListItem from "./WorkstationListItem"

const entryName = "workstations"

const label =
  entryName && entryName in names
    ? _.capitalize(names[entryName as keyof typeof names].plural)
    : undefined

interface WorkstationsListProps {
  selectedId: number | null
  onAddElement?: () => void
}

const WorkstationsList = (props: WorkstationsListProps) => {
  const router = useRouter()
  return (
    <ApiList
      ListItem={WorkstationListItem}
      entryName={entryName}
      label={label}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      {...props}
      showAddButton
    />
  )
}

export default WorkstationsList
