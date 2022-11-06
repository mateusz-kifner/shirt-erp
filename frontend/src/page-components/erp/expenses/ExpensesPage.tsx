import template from "../../../models/expense.model.json"

import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import { useRouter } from "next/router"
import Workspace from "../../../components/layout/Workspace"
import { getQueryAsIntOrNull } from "../../../utils/nextQueryUtils"
import ExpenseList from "./ExpensesList"
import ExpenseAddModal from "./ExpenseAddModal"
import { useState } from "react"
import { Notebook, List } from "tabler-icons-react"

const entryName = "expenses"

const ExpensePage = () => {
  const [openAddModal, setOpenAddModal] = useState<boolean>(false)

  const router = useRouter()
  const id = getQueryAsIntOrNull(router, "id")
  const currentView = id ? [0, 1] : 0

  return (
    <>
      <Workspace
        childrenLabels={
          id ? ["Lista wydatków", "Właściwości"] : ["Lista wydatków"]
        }
        childrenIcons={[List, Notebook]}
      >
        <ExpenseList
          selectedId={id}
          onAddElement={() => setOpenAddModal(true)}
        />
        <ApiEntryEditable template={template} entryName={entryName} id={id} />
      </Workspace>
      <ExpenseAddModal
        opened={openAddModal}
        onClose={(id) => {
          setOpenAddModal(false)
          id !== undefined &&
            router.push(`/erp/expenses/${id}?pinned=0&active=1`)
        }}
      />
    </>
  )
}

export default ExpensePage
