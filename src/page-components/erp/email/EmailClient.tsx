import { EmailCredentialType } from "@/schema/emailCredential";
import { useState } from "react";
import EmailFolderTree from "./EmailFolderTree";
import EmailList from "./EmailList";
import EmailView from "./EmailView";
import { EmailContextProvider } from "./emialContext";

interface EmailClientProps {
  emailClient: EmailCredentialType;
}

function EmailClient(props: EmailClientProps) {
  const { emailClient } = props;
  const [activeMailbox, setActiveMailbox] = useState("INBOX");
  const [selectedUid, setSelectedUid] = useState<number | null>(null);
  return (
    <EmailContextProvider emailConfig={emailClient}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <EmailFolderTree
            active={activeMailbox}
            onActive={(val) => val && setActiveMailbox(val)}
          />
          <EmailList mailbox={activeMailbox} onSelect={setSelectedUid} />
        </div>
        <div className="relative flex flex-col gap-4 p-4">
          <EmailView mailbox={activeMailbox} id={selectedUid} />
        </div>
      </div>
    </EmailContextProvider>
  );
}

export default EmailClient;
