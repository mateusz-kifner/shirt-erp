import { FC, useEffect, useState } from "react"
import ApiList from "../../../components/api/ApiList"
import ExpenseListItem from "./ExpenseListItem"
import _ from "lodash"
import names from "../../../models/names.json"
import { useRouter } from "next/router"

const entryName = "expenses"

const label =
  entryName && entryName in names
    ? _.capitalize(names[entryName as keyof typeof names].plural)
    : undefined

interface ExpenseListProps {
  selectedId: number | null
  onAddElement?: () => void
}

const ExpensesList = ({ selectedId, onAddElement }: ExpenseListProps) => {
  // const [id, setId] = useState<number | null>(null)
  const router = useRouter()

  return (
    <ApiList
      ListItem={ExpenseListItem}
      entryName={entryName}
      label={label}
      selectedId={selectedId}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
      onAddElement={onAddElement}
      showAddButton
    />
  )
}

export default ExpensesList
