import { FC, useEffect, useState } from "react"
import ApiList from "../../../components/api/ApiList"
import ClientListItem from "./ClientListItem"
import _ from "lodash"
import names from "../../../models/names.json"
import { useRouter } from "next/router"

const entryName = "clients"

const ClientsList = ({ selectedId }: { selectedId: number | null }) => {
  // const [id, setId] = useState<number | null>(null)
  const router = useRouter()

  return (
    <ApiList
      ListItem={ClientListItem}
      entryName={entryName}
      label={
        entryName && entryName in names
          ? _.capitalize(names[entryName as keyof typeof names].plural)
          : undefined
      }
      spacing="xl"
      listSpacing="sm"
      selectedId={selectedId}
      onChange={(val: any) => {
        console.log(val)
        // setId(val.id)
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
    />
  )
}

export default ClientsList
