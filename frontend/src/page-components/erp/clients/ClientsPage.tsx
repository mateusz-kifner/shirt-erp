import template from "../../../models/client.model.json"

import { FC, useEffect, useState } from "react"

import _ from "lodash"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"
import { useRouter } from "next/router"

const entryName = "clients"

const ClientsPage: FC = ({}) => {
  const [id, setId] = useState<number | null>(null)
  const router = useRouter()

  const params = router.query
  useEffect(() => {
    if (typeof params?.id === "string" && parseInt(params.id) > 0)
      setId(parseInt(params.id))
  }, [params])
  console.log(id)
  return (
    // <AdvancedWorkspace>
    <ApiEntryEditable template={template} entryName={entryName} id={id} />
    // </AdvancedWorkspace>
  )
}

export default ClientsPage
