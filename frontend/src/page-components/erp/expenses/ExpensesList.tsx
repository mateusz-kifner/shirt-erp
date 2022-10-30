import ApiList from "../../../components/api/ApiList"
import ExpenseListItem from "./ExpenseListItem"
import _ from "lodash"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"

const entryName = "expenses"

interface ExpenseListProps {
  selectedId: number | null
  onAddElement?: () => void
}

const ExpensesList = ({ selectedId, onAddElement }: ExpenseListProps) => {
  // const [id, setId] = useState<number | null>(null)
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <ApiList
      ListItem={ExpenseListItem}
      entryName={entryName}
      label={
        entryName ? _.capitalize(t(`${entryName}.plural` as any)) : undefined
      }
      selectedId={selectedId}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
      filterKeys={["name"]}
      onAddElement={onAddElement}
      showAddButton
      exclude={{ username: "Szablon" }}
    />
  )
}

export default ExpensesList
