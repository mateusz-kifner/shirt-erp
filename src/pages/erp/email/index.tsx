import { api } from "@/utils/api";

interface EmailPageProps {}

function EmailPage(props: EmailPageProps) {
  const {} = props;
  const { data } = api.mail.getById.useQuery();
  return <div>{data && data.map((val) => val.uid)}</div>;
}

export default EmailPage;
