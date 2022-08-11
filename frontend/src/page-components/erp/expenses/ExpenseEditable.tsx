import { useRouter } from "next/router"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import template from "../../../models/expense.model.json"

const entryName = "expenses"

const ExpenseEditable = () => {
  const router = useRouter()

  const params = router.query

  return (
    <ApiEntryEditable
      template={template}
      entryName={entryName}
      id={typeof params.id === "string" ? parseInt(params.id) : null}
    />
  )
}

export default ExpenseEditable
