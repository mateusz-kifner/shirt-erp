import { Group } from "@mantine/core"
import { useEffect, useState } from "react"

import ApiList from "./api/ApiList"
import ResponsivePaper from "./ResponsivePaper"
import ApiEntryEditable from "./api/ApiEntryEditable"
import DefaultListItem from "./DefaultListItem"
import { useRouter } from "next/router"
import { useTranslation } from "../i18n"
import { capitalize } from "lodash"

interface DefaultPageProps {
  entryName: string
  template: object
  ListElement?: React.ElementType
}

const DefaultPage = ({
  entryName,
  template,
  ListElement,
}: DefaultPageProps) => {
  const { t } = useTranslation()
  const [id, setId] = useState<number | null>(null)
  const ListElem = ListElement ?? DefaultListItem
  const router = useRouter()
  const params = router.query
  useEffect(() => {
    if (typeof params?.id === "string" && parseInt(params.id) > 0) {
      setId(parseInt(params.id))
    }
  }, [params?.id])

  return (
    <div className="flex flex-row gap-3 flex-nowrap items-start p-4 sm:0">
      <ResponsivePaper>
        <ApiList
          ListItem={ListElem}
          entryName={entryName}
          label={
            entryName
              ? capitalize(t(`${entryName}.singular` as any))
              : undefined
          }
          onChange={(val: any) => {
            router.push("/erp/" + entryName + "/" + val.id)
          }}
        />
      </ResponsivePaper>
      <ResponsivePaper style={{ flexGrow: 1 }}>
        <ApiEntryEditable template={template} entryName={entryName} id={id} />
      </ResponsivePaper>
    </div>
  )
}

export default DefaultPage
