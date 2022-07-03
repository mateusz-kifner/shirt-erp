import template from "../../../models/client.model.json"

import { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import _ from "lodash"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import AdvancedWorkspace from "../../../components/AdvancedWorkspace"

const entryName = "clients"

const ClientsPage: FC = ({}) => {
  const [id, setId] = useState<number | null>(null)
  const params = useParams()
  useEffect(() => {
    if (params?.id && parseInt(params.id) > 0) setId(parseInt(params.id))
  }, [params])
  console.log(id)
  return (
    // <AdvancedWorkspace>
    <ApiEntryEditable template={template} entryName={entryName} id={id} />
    // </AdvancedWorkspace>
  )
}

export default ClientsPage
