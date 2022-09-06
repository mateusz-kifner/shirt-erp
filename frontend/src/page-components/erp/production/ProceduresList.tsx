import _ from "lodash"
import { useRouter } from "next/router"
import ApiList from "../../../components/api/ApiList"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import names from "../../../models/names.json"

const entryName = "procedures"

const label =
  entryName && entryName in names
    ? _.capitalize(names[entryName as keyof typeof names].plural)
    : undefined

interface OrderListProps {
  selectedId: number | null
  onAddElement?: () => void
}

const ProceduresList = (props: OrderListProps) => {
  const router = useRouter()
  return (
    <ApiList
      ListItem={makeDefaultListItem("name")}
      entryName={entryName}
      label={label}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      {...props}
    />
  )
}

export default ProceduresList
