import EmailFolderTree from "./EmailFolderTree";

interface EmailClientProps {
  mailboxId: number;
}

function EmailClient(props: EmailClientProps) {
  const { mailboxId } = props;
  return (
    <>
      <EmailFolderTree mailboxId={mailboxId} />
    </>
  );
}

export default EmailClient;
