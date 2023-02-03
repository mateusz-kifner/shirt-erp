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
import DeleteButton from "../../../components/DeleteButton"
import { useRouter } from "next/router"
import ApiEntryEditable from "../../../components/api/ApiEntryEditable"

const template = {
  attachments: {
    label: "Pliki",
    type: "files",
    initialValue: [],
  },
  orders: {
    label: "Zamówienia",
    type: "array",
    arrayType: "apiEntry",
    entryName: "orders",
    linkEntry: true,
  },
  nextMessageId: {
    label: "Następna wiadomość",
    type: "apiEntryId",
    entryName: "email-messages",
    linkEntry: true,
    allowClear: true,
  },
}

const entryName = "email-messages"
interface EmailMessagesViewProps {
  id: number | null
}

const EmailMessagesView = ({ id }: EmailMessagesViewProps) => {
  const {
    emailMessageHtmlAllowed,
    emailMessageDisableHtml,
    emailMessageEnableHtml,
  } = useEmailContext()

  const { data, remove } = useStrapi<EmailMessageType>(entryName, id, {
    query: "populate=*",
  })
  const router = useRouter()
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
        flexGrow: 1,
      })}
    >
      {data && (
        <Stack style={{ flexGrow: 1 }}>
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

          <ApiEntryEditable
            disabled={true}
            template={template}
            entryName={"email-messages"}
            id={id}
          />
          <DeleteButton
            label="mail"
            onDelete={() =>
              id && remove(id).then(() => router.push("/erp/" + entryName))
            }
          />
        </Stack>
      )}
    </Group>
  )
}

export default EmailMessagesView
