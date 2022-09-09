import template from "../../../models/expense.model.json"

import _ from "lodash"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import { useRouter } from "next/router"
import Workspace from "../../../components/layout/Workspace"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import ExpenseList from "./ExpensesList"
import ExpenseAddModal from "./ExpenseAddModal"
import { useState } from "react"

const entryName = "expenses"

const ExpensePage = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false)

  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")
  const currentView = id ? [0, 1] : 0

  return (
    <>
      <Workspace
        childrenLabels={["Lista klientów", "Właściwości"]}
        defaultViews={currentView}
      >
        <ExpenseList
          selectedId={id}
          onAddElement={() => setOpenAddModal(true)}
        />
        <ApiEntryEditable template={template} entryName={entryName} id={id} />
      </Workspace>
      <ExpenseAddModal
        opened={openAddModal}
        onClose={() => setOpenAddModal(false)}
      />
    </>
  )
}

export default ExpensePage
