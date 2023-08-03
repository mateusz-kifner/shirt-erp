import { Tab } from "@/components/layout/MultiTabs";
import Workspace from "@/components/layout/Workspace";
import EmailClient from "@/page-components/erp/email/EmailClient";
import EmailSendModal from "@/page-components/erp/email/EmailSendModal";
import { api } from "@/utils/api";
import { getQueryAsIntOrNull } from "@/utils/query";
import { useMediaQuery } from "@mantine/hooks";
import { IconMail, IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

const entryName = "email";

interface EmailPageProps {}

function EmailPage(props: EmailPageProps) {
  const {} = props;
  const { data: mailboxes } = api.email.getEmails.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const [openSendModal, setOpenSendModal] = useState<boolean>(false);
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)",
  );
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  const mailboxesIMAP = mailboxes
    ? mailboxes.filter((val) => val.protocol === "imap")
    : [];
  const mailboxesSMTP = mailboxes
    ? mailboxes.filter((val) => val.protocol === "smtp")
    : [];

  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        childrenLabels={mailboxesIMAP.map((m) => m.user ?? "")}
        childrenIcons={[IconMail]}
        defaultActive={0}
        defaultPinned={[]}
        childrenWrapperProps={[]}
        rightMenuSection={
          <Tab
            value={-1}
            className="p-2"
            onClick={() => setOpenSendModal(true)}
          >
            <IconPencil />
          </Tab>
        }
        disablePin
      >
        {mailboxesIMAP.map((mailbox) => (
          <div className="relative flex flex-col gap-4 p-4">
            <EmailClient mailboxId={mailbox.id} />
          </div>
        ))}
      </Workspace>
      <EmailSendModal
        opened={openSendModal}
        onClose={(id?: number) => {
          setOpenSendModal(false);
          id !== undefined &&
            router.push(`/erp/client/${id}`).catch((e) => {
              throw e;
            });
        }}
      />
    </div>
  );
}

export default EmailPage;
