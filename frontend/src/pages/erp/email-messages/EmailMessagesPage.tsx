import { Group, Menu, Stack, Title } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import ApiList from "../../../components/api/ApiList"
import ResponsivePaper from "../../../components/ResponsivePaper"
import DefaultListItem, {
  makeDefaultListItem,
} from "../../../components/DefaultListItem"
import names from "../../../models/names.json"
import _ from "lodash"
import useStrapi from "../../../hooks/useStrapi"
import DOMPurify from "dompurify"
import DisplayCell from "../../../components/details/DisplayCell"
import FileList from "../../../components/FileList"
import { Radioactive, RadioactiveOff, X } from "../../../utils/TablerIcons"
import { useRecoilState } from "recoil"
import { emailMessageState } from "../../../atoms/emailMessageState"

const entryName = "email-messages"

const EmailMessagesPage: FC = () => {
  const [id, setId] = useState<number | null>(null)
  const ListElem = makeDefaultListItem("subject")
  const navigate = useNavigate()
  const params = useParams()
  useEffect(() => {
    if (params?.id && parseInt(params.id) > 0) setId(parseInt(params.id))
  })

  const [emailMessage, setEmailMessage] = useRecoilState(emailMessageState)
  const { data } = useStrapi(entryName, id, { query: "populate=*" })

  const isDangerous = emailMessage.includes(id)
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
            navigate("/erp/" + entryName + "/" + val.id)
          }}
        />
      </ResponsivePaper>
      <ResponsivePaper style={{ flexGrow: 1 }}>
        {data && (
          <Stack>
            <Group>
              <Title order={3} style={{ flexGrow: 1 }}>
                {data.subject}
              </Title>
              <Menu withArrow>
                {isDangerous ? (
                  <Menu.Item
                    icon={<RadioactiveOff />}
                    onClick={() =>
                      setEmailMessage((val: number[]) =>
                        val.filter((val2) => val2 !== id)
                      )
                    }
                  >
                    Ukryj HTML
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    icon={<Radioactive />}
                    color="red"
                    onClick={() =>
                      setEmailMessage((val: number[]) => [...val, id])
                    }
                  >
                    Pokaż HTML
                  </Menu.Item>
                )}
              </Menu>
            </Group>

            <Group>
              {data.from} {"->"} {data.to}
            </Group>
            <DisplayCell>
              <div
                dangerouslySetInnerHTML={{
                  __html: isDangerous
                    ? DOMPurify.sanitize(data.html)
                    : DOMPurify.sanitize(data.textAsHtml),
                }}
              ></div>
            </DisplayCell>
            <FileList
              value={
                data?.attachments && Array.isArray(data?.attachments)
                  ? data.attachments
                  : []
              }
              disabled={true}
            />
          </Stack>
        )}
      </ResponsivePaper>
    </Group>
  )
}

export default EmailMessagesPage
