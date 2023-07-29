import { api } from "@/utils/api";

interface EmailPageProps {}

function EmailPage(props: EmailPageProps) {
  const {} = props;
  const { data } = api.mail.getEmails.useQuery();
  return <div>{data && data.map((val) => val.user)}</div>;
}

export default EmailPage;
