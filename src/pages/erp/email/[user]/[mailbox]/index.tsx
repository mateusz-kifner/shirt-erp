import { useRouter } from "next/router";

interface EmailMailboxProps {}

function EmailMailbox(props: EmailMailboxProps) {
  const {} = props;
  const { query } = useRouter();
  const { mailbox, user } = query;
  return (
    <>
      {user} / {mailbox}
    </>
  );
}

export default EmailMailbox;
