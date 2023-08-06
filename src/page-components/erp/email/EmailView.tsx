import Editable from "@/components/editable/Editable";
import EditableDateTime from "@/components/editable/EditableDateTime";
import EditableDebugInfo from "@/components/editable/EditableDebugInfo";
import EditableFiles from "@/components/editable/EditableFiles";
import EditableObject from "@/components/editable/EditableObject";
import EditableRichText from "@/components/editable/EditableRichText";
import EditableShortText from "@/components/editable/EditableShortText";
import Button from "@/components/ui/Button";
import Wrapper from "@/components/ui/Wrapper";
import { useLoaded } from "@/hooks/useLoaded";
import { api } from "@/utils/api";
import { IconRefresh } from "@tabler/icons-react";
import { useEmailContext } from "./emialContext";

interface EmailViewProps {
  id: number | null;
  mailbox: string;
}

function EmailView(props: EmailViewProps) {
  const { id, mailbox } = props;
  const isLoaded = useLoaded();
  const { emailConfig } = useEmailContext();
  const { data, refetch } = api.email.getByUid.useQuery(
    { emailClientId: emailConfig.id, mailbox, emailId: id as number },
    {
      enabled: id !== null,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  console.log(data);
  if (!data)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        Brak danych
      </div>
    );

  return (
    <Editable data={data}>
      <EditableDebugInfo label="ID: " keyName="id" />
      <EditableObject keyName="envelope">
        <Wrapper
          keyName="subject" // hint for Editable
          wrapperClassName="flex gap-2 items-center"
          wrapperRightSection={
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              onClick={() => {
                refetch();
              }}
            >
              <IconRefresh />
            </Button>
          }
        >
          <EditableShortText
            keyName="subject"
            required
            style={{ fontSize: "1.4em" }}
            disabled
          />
        </Wrapper>
        <EditableShortText keyName="from" label="Od" disabled />
        <EditableShortText keyName="to" label="Do" disabled />
        <EditableDateTime keyName="date" label="Data" disabled collapse />

        <EditableRichText label="Wiadomość" keyName="html" disabled />
        <EditableFiles keyName="attachments" label="Pliki" disabled />
      </EditableObject>
    </Editable>
  );
}

export default EmailView;
