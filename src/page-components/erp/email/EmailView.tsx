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
import { EmailCredentialType } from "@/schema/emailCredential";
import { api } from "@/utils/api";
import { IconRefresh } from "@tabler/icons-react";

interface EmailViewProps {
  emailConfig: EmailCredentialType;
  id: number | null;
  mailbox: string;
}

function EmailView(props: EmailViewProps) {
  const { id, mailbox, emailConfig } = props;
  const isLoaded = useLoaded();
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

  if (data.avIsInfected)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        Email zawiera wirusy
      </div>
    );

  return (
    <div className="p-2">
      <Editable data={data}>
        <EditableDebugInfo label="ID: " keyName="id" />
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
        <EditableObject keyName="from">
          <EditableShortText keyName="text" label="Od" disabled />
        </EditableObject>
        <EditableObject keyName="to">
          <EditableShortText keyName="text" label="Do" disabled />
        </EditableObject>
        <EditableDateTime keyName="date" label="Data" disabled collapse />

        <EditableRichText label="Wiadomość" keyName="html" disabled />
        <EditableFiles keyName="attachments" label="Pliki" disabled />
      </Editable>
      {data.attachments.map((file, index) =>
        file.preview ? (
          <img src={`data:image/jpeg;base64,${file.preview}`} />
        ) : null,
      )}
    </div>
  );
}

export default EmailView;
