import { useParams } from "react-router-dom"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import template from "../../../templates/expense.template.json"

const entryName = "expenses"

const ExpenseEditable = () => {
  const params = useParams()

  return (
    <ApiEntryEditable
      template={template}
      entryName={entryName}
      id={params.id ? parseInt(params.id) : null}
    />
  )
}

export default ExpenseEditable
