import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ApiList from "../../../components/api/ApiList"
import ExpenseListItem from "./ExpenseListItem"
import _ from "lodash"
import names from "../../../models/names.json"

const entryName = "expenses"

interface ExpensesListProps {
  // children?: ReactNode
}

const ExpensesList: FC<ExpensesListProps> = ({}) => {
  const [id, setId] = useState<number | null>(null)
  const navigate = useNavigate()
  const params = useParams()
  useEffect(() => {
    if (params?.id && parseInt(params.id) > 0) setId(parseInt(params.id))
  })
  return (
    <>
      <ApiList
        ListItem={ExpenseListItem}
        entryName={entryName}
        // @ts-ignore
        label={_.capitalize(names[entryName].plural)}
        spacing="xl"
        listSpacing="sm"
        onChange={(val: any) => {
          console.log(val)
          setId(val.id)
          navigate("/erp/" + entryName + "/" + val.id)
        }}
        listItemProps={{
          linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
        }}
      />
    </>
  )
}

export default ExpensesList
