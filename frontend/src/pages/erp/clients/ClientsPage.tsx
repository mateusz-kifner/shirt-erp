import template from "../../../models/client.model.json"
import ClientListItem from "../../../components/list_items/ClientListItem"

import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import names from "../../../models/names.json"
import _ from "lodash"
import ApiList from "../../../components/api/ApiList"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import AdvancedWorkspace from "../../../components/AdvancedWorkspace"

const entryName = "clients"

const ClientsPage: FC = ({}) => {
  const [id, setId] = useState<number | null>(null)
  const ListElem = ClientListItem
  const navigate = useNavigate()
  const params = useParams()
  useEffect(() => {
    if (params?.id && parseInt(params.id) > 0) setId(parseInt(params.id))
  })

  return (
    <AdvancedWorkspace
      navigation={
        <ApiList
          ListItem={ListElem}
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
        />
      }
    >
      <ApiEntryEditable template={template} entryName={entryName} id={id} />
    </AdvancedWorkspace>
  )
}

export default ClientsPage
