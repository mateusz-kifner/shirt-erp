import {
  ActionIcon,
  Group,
  Menu,
  Stack,
  Title,
  TypographyStylesProvider,
} from "@mantine/core"
import useStrapi from "../../../hooks/useStrapi"
import DOMPurify from "dompurify"
import { Dots, Radioactive, RadioactiveOff } from "tabler-icons-react"
import { EmailMessageType } from "../../../types/EmailMessageType"
import { useEmailContext } from "../../../context/emailContext"
import EditableFiles from "../../../components/editable/EditableFiles"

const entryName = "email-client/messages"
interface EmailMessagesViewProps {
  id: number | null
}

const EmailMessagesView = ({ id }: EmailMessagesViewProps) => {
  const {
    emailMessageHtmlAllowed,
    emailMessageDisableHtml,
    emailMessageEnableHtml,
  } = useEmailContext()

  const { data } = useStrapi<EmailMessageType>(entryName, id, {
    query: "populate=*",
  })
  console.log(data)
  const isDangerous = id ? emailMessageHtmlAllowed.includes(id) : false
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
                    onClick={() => id && emailMessageDisableHtml(id)}
                  >
                    Ukryj HTML
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    icon={<Radioactive />}
                    color="red"
                    onClick={() => id && emailMessageEnableHtml(id)}
                  >
                    Pokaż HTML
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Group>
            {"Od: "}
            {data.from} {", Do: "} {data.to}
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
          <EditableFiles
            value={
              data?.attachments && Array.isArray(data?.attachments)
                ? data.attachments
                : []
            }
            disabled={true}
            active={false}
          />
        </Stack>
      )}
    </Group>
  )
}

export default EmailMessagesView
