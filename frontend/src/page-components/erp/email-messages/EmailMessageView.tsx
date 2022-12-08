import {
  ActionIcon,
  Group,
  Menu,
  Title,
  TypographyStylesProvider,
} from "@mantine/core"
import useStrapi from "../../../hooks/useStrapi"
import DOMPurify from "dompurify"
import FileList from "../../../components/FileList"
import { Dots, Radioactive, RadioactiveOff } from "tabler-icons-react"
import { EmailMessageType } from "../../../types/EmailMessageType"
import { useEmailContext } from "../../../context/emailContext"

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
    <div className="flex flex-row gap-3 flex-nowrap items-start p-4 max-w-full sm:p-0">
      {data && (
        <div className="flex flex-col max-w-[100%] gap-3">
          <div className="flex flex-row max-w-[100%] gap-3">
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
          </div>

          <div className="flex flex-row gap-3">
            {"Od: "}
            {data.from} {", Do: "} {data.to}
          </div>
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
        </div>
      )}
    </div>
  )
}

export default EmailMessagesView
