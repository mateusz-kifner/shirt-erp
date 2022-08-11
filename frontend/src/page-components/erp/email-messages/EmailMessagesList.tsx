import { useEffect, useState } from "react"

import ApiList from "../../../components/api/ApiList"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import names from "../../../models/names.json"

import _ from "lodash"
import { useRouter } from "next/router"

const entryName = "email-messages"

const EmailMessagesList = () => {
  const [id, setId] = useState<number | null>(null)

  const ListElem = makeDefaultListItem("subject")
  const router = useRouter()
  const params = router.query
  useEffect(() => {
    if (typeof params?.id === "string" && parseInt(params.id) > 0)
      setId(parseInt(params.id))
  })
  return (
    <ApiList
      ListItem={ListElem}
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
        setId(val.id)
        router.push("/erp/" + entryName + "/" + val.id)
      }}
    />
  )
}

export default EmailMessagesList
