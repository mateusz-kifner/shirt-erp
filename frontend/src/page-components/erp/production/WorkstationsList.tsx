import _ from "lodash"
import { useRouter } from "next/router"
import ApiList from "../../../components/api/ApiList"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import names from "../../../models/names.json"

const entryName = "workstations"

const ProceduresList = () => {
  const router = useRouter()
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
        router.push("/erp/" + entryName + "/" + val.id)
      }}
    />
  )
}

export default ProceduresList
