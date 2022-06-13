import { FC } from "react"

import template from "../../../models/expense.model.json"
import ExpenseListItem from "../../../components/list_items/ExpenseListItem"
import DefaultPage from "../../../components/DefaultPage"

const ExpensesPage: FC = () => {
  return (
    <DefaultPage
      template={template}
      ListElement={ExpenseListItem}
      entryName="expenses"
    />
  )
}

export default ExpensesPage
