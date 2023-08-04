import { useState } from "react";
import EmailFolderTree from "./EmailFolderTree";
import EmailList from "./EmailList";

interface EmailClientProps {
  emailClientId: number;
}

function EmailClient(props: EmailClientProps) {
  const { emailClientId } = props;
  const [activeMailbox, setActiveMailbox] = useState("INBOX");
  return (
    <>
      <EmailFolderTree
        emailClientId={emailClientId}
        active={activeMailbox}
        onActive={(val) => val && setActiveMailbox(val)}
      />
      <EmailList emailClientId={emailClientId} mailbox={activeMailbox} />
    </>
  );
}

export default EmailClient;
