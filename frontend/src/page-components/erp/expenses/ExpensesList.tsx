import { FC, useEffect, useState } from "react"

import ApiList from "../../../components/api/ApiList"
import ExpenseListItem from "./ExpenseListItem"
import _ from "lodash"
import names from "../../../models/names.json"
import { useRouter } from "next/router"

const entryName = "expenses"

interface ExpensesListProps {
  // children?: ReactNode
}

const ExpensesList: FC<ExpensesListProps> = ({}) => {
  const [id, setId] = useState<number | null>(null)
  const router = useRouter()
  const params = router.query
  useEffect(() => {
    if (typeof params?.id === "string" && parseInt(params.id) > 0)
      setId(parseInt(params.id))
  }, [params.id])
  return (
    <ApiList
      ListItem={ExpenseListItem}
      entryName={entryName}
      label={
        entryName && entryName in names
          ? _.capitalize(names[entryName as keyof typeof names].plural)
          : undefined
      }
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
    />
  )
}

export default ExpensesList
