import { Tab } from "@/components/layout/MultiTabs";
import Workspace from "@/components/layout/Workspace";
import EmailClient from "@/page-components/erp/email/EmailClient";
import EmailSendModal from "@/page-components/erp/email/EmailSendModal";
import { api } from "@/utils/api";
import { getQueryAsIntOrNull } from "@/utils/query";
import { useMediaQuery } from "@mantine/hooks";
import { IconMail, IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useId, useState } from "react";

const entryName = "email";

interface EmailPageProps {}

function EmailPage(props: EmailPageProps) {
  const {} = props;
  const uuid = useId();
  const { data: emailClients } = api.email.getAllConfigs.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const [openSendModal, setOpenSendModal] = useState<boolean>(false);
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)",
  );
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  const emailClientsIMAP = emailClients
    ? emailClients.filter((client) => client.protocol === "imap")
    : [];
  const emailClientsSMTP = emailClients
    ? emailClients.filter((client) => client.protocol === "smtp")
    : [];

  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        childrenLabels={emailClientsIMAP.map((client) => client.user ?? "")}
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
        {emailClientsIMAP.map((client, index) => (
          <div className="relative p-4" key={`${uuid}${index}`}>
            <EmailClient emailClientId={client.id} />
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
