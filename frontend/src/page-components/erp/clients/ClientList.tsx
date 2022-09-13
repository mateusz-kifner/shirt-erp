import { FC, useEffect, useState } from "react"
import ApiList from "../../../components/api/ApiList"
import ClientListItem from "./ClientListItem"
import _ from "lodash"
import names from "../../../models/names.json"
import { useRouter } from "next/router"

const entryName = "clients"

interface ClientListProps {
  selectedId: number | null
  onAddElement?: () => void
}

const ClientsList = ({ selectedId, onAddElement }: ClientListProps) => {
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
      selectedId={selectedId}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
      listItemProps={{
        linkTo: (val: any) => "/erp/" + entryName + "/" + val.id,
      }}
      filterKeys={["username", "firstname", "email", "companyName"]}
      onAddElement={onAddElement}
      showAddButton
    />
  )
}

export default ClientsList
