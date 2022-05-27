import { FC } from "react"

import expense_schema from "../../../schemas/expense.schema.json"
import ExpenseListItem from "./ExpenseListItem"
import DefaultPage from "../../../components/DefaultPage"

const ExpensesPage: FC = () => {
  return (
    <DefaultPage
      schema={expense_schema}
      ListElement={ExpenseListItem}
      entryName="expenses"
    />
  )
}

export default ExpensesPage
