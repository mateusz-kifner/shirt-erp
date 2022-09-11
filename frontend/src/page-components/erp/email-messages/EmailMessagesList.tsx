import { useState } from "react"

import ApiList from "../../../components/api/ApiList"
import { makeDefaultListItem } from "../../../components/DefaultListItem"
import names from "../../../models/names.json"

import _ from "lodash"
import { useRouter } from "next/router"

const entryName = "email-messages"
const label =
  entryName && entryName in names
    ? _.capitalize(names[entryName as keyof typeof names].plural)
    : undefined

interface EmailMessagesProps {
  selectedId: number | null
}

const EmailMessagesList = ({ selectedId }: EmailMessagesProps) => {
  const ListElem = makeDefaultListItem("subject")
  const router = useRouter()

  return (
    <ApiList
      ListItem={ListElem}
      entryName={entryName}
      label={label}
      selectedId={selectedId}
      onChange={(val: any) => {
        router.push("/erp/" + entryName + "/" + val.id)
      }}
    />
  )
}

export default EmailMessagesList
