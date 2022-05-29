import { FC } from "react"

import template from "../../../data/models/expense.template.json"
import ExpenseListItem from "./ExpenseListItem"
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
