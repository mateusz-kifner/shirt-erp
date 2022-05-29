import { Group } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import ApiList from "./api/ApiList"
import ResponsivePaper from "./ResponsivePaper"
import ApiEntryDetails from "./api/ApiEntryDetails"
import DefaultListItem from "./DefaultListItem"
import names from "../model-templates/names.json"
import _ from "lodash"

interface DefaultPageProps {
  entryName: string
  template: object
  ListElement?: React.ElementType
}

const DefaultPage: FC<DefaultPageProps> = ({
  entryName,
  template,
  ListElement,
}) => {
  const [id, setId] = useState<number | null>(null)
  const ListElem = ListElement ? ListElement : DefaultListItem
  const navigate = useNavigate()
  const params = useParams()
  useEffect(() => {
    if (params?.id && parseInt(params.id) > 0) setId(parseInt(params.id))
  })

  return (
    <Group
      sx={(theme) => ({
        flexWrap: "nowrap",
        alignItems: "flex-start",
        padding: theme.spacing.xl,
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          padding: 0,
        },
      })}
    >
      <ResponsivePaper>
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
      </ResponsivePaper>
      <ResponsivePaper style={{ flexGrow: 1 }}>
        <ApiEntryDetails template={template} entryName={entryName} id={id} />
      </ResponsivePaper>
    </Group>
  )
}

export default DefaultPage
