import _ from "lodash"
import { useNavigate } from "react-router-dom"
import ApiList from "../../../components/api/ApiList"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import names from "../../../models/names.json"

const entryName = "procedures"

const ProceduresList = () => {
  const navigate = useNavigate()
  return (
    <ApiList
      ListItem={makeDefaultListItem("name")}
      entryName={entryName}
      label={
        entryName && entryName in names
          ? _.capitalize(names[entryName as keyof typeof names].plural)
          : undefined
      }
      spacing="xl"
      listSpacing="sm"
      onChange={(val: any) => {
        console.log(val)
        // setId(val.id)
        navigate("/erp/" + entryName + "/" + val.id)
      }}
    />
  )
}

export default ProceduresList
