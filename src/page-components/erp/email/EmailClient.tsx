import { EmailCredentialType } from "@/schema/emailCredential";
import { useState } from "react";
import EmailFolderTree from "./EmailFolderTree";
import EmailList from "./EmailList";
import { EmailContextProvider } from "./emialContext";

interface EmailClientProps {
  emailClient: EmailCredentialType;
}

function EmailClient(props: EmailClientProps) {
  const { emailClient } = props;
  const [activeMailbox, setActiveMailbox] = useState("INBOX");
  return (
    <EmailContextProvider defaultData={{ emailConfig: emailClient }}>
      <div className="flex gap-2">
        <EmailFolderTree
          emailClient={emailClient}
          active={activeMailbox}
          onActive={(val) => val && setActiveMailbox(val)}
        />
        <EmailList mailbox={activeMailbox} />
      </div>
    </EmailContextProvider>
  );
}

export default EmailClient;
