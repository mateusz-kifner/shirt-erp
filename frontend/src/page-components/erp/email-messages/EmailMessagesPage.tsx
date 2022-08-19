import {
  ActionIcon,
  Group,
  Menu,
  Stack,
  Title,
  TypographyStylesProvider,
} from "@mantine/core"
import { FC, useEffect, useState } from "react"
import names from "../../../models/names.json"
import _ from "lodash"
import useStrapi from "../../../hooks/useStrapi"
import DOMPurify from "dompurify"
import FileList from "../../../components/FileList"
import { Dots, Radioactive, RadioactiveOff } from "tabler-icons-react"
import { useRouter } from "next/router"
import { EmailMessageType } from "../../../types/EmailMessageType"

const entryName = "email-messages"

const EmailMessagesPage: FC = () => {
  const [id, setId] = useState<number | null>(null)
  const router = useRouter()
  const params = router.query
  useEffect(() => {
    if (typeof params?.id === "string" && parseInt(params.id) > 0)
      setId(parseInt(params.id))
  }, [params.id])

  // FIXME: put it in global state
  const [emailMessage, setEmailMessage] = useState<any[]>([])

  const { data } = useStrapi<EmailMessageType>(entryName, id, {
    query: "populate=*",
  })

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
      {data && (
        <Stack>
          <Group>
            <Title order={3} style={{ flexGrow: 1 }}>
              {data.subject}
            </Title>
            <Menu withArrow>
              <Menu.Target>
                <ActionIcon tabIndex={-1}>
                  <Dots size={14} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
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
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Group>
            {data.from} {"->"} {data.to}
          </Group>
          <TypographyStylesProvider>
            <div
              dangerouslySetInnerHTML={{
                __html: isDangerous
                  ? DOMPurify.sanitize(data.html)
                  : DOMPurify.sanitize(data.textAsHtml),
              }}
            ></div>
          </TypographyStylesProvider>
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
    </Group>
  )
}

export default EmailMessagesPage
