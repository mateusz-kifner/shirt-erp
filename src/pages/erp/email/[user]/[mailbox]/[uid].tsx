import { useRouter } from "next/router";

interface EmailMessageProps {}

function EmailMessage(props: EmailMessageProps) {
  const {} = props;
  const { query } = useRouter();
  const { mailbox, user, uid } = query;

  return (
    <>
      {user} / {mailbox} / {uid}
    </>
  );
}

export default EmailMessage;
