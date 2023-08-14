import { Tab } from "@/components/layout/MultiTabs";
import Workspace from "@/components/layout/Workspace";
import EmailSendModal from "@/page-components/erp/email/EmailSendModal";
import { api } from "@/utils/api";
import { getQueryAsIntOrNull } from "@/utils/query";
import { useMediaQuery } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useId, useState } from "react";

const entryName = "email";

interface EmailPageProps {}

function EmailPage(props: EmailPageProps) {
  const {} = props;
  const uuid = useId();
  const { data: emailClients, isLoading } = api.email.getAllConfigs.useQuery(
    undefined,
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );
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
  useEffect(() => {
    if (emailClientsIMAP.length > 0 && emailClientsIMAP[0]?.user !== undefined)
      router.replace(`./email/${emailClientsIMAP[0].user}/INBOX`);
  }, [emailClientsIMAP.length]);

  return (
    <div className="flex gap-4">
      {!!isLoading || emailClientsIMAP.length > 0 ? (
        <span>Loading...</span>
      ) : (
        <div className="flex gap-4">
          <Workspace
            cacheKey={entryName}
            childrenLabels={[]}
            childrenIcons={[]}
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
            <span>No emails configured</span>
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
      )}
    </div>
  );
}

export default EmailPage;
