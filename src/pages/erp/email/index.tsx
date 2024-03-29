import Workspace from "@/components/layout/WorkspaceOld";
import EmailSendModal from "@/page-components/erp/email/EmailSendModal";
import { createRedirectByRole } from "@/utils/redirectByRole";
import { trpc } from "@/utils/trpc";
// import { getQueryAsIntOrNull } from "@/utils/query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const entryName = "email";

function EmailPage() {
  const { data: emailClients, isLoading } = trpc.email.getAllConfigs.useQuery(
    undefined,
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );
  const [openSendModal, setOpenSendModal] = useState<boolean>(false);

  const router = useRouter();
  // const id = getQueryAsIntOrNull(router, "id");

  const emailClientsIMAP = emailClients
    ? emailClients.filter((client) => client.protocol === "imap")
    : [];
  // const emailClientsSMTP = emailClients
  //   ? emailClients.filter((client) => client.protocol === "smtp")
  //   : [];

  useEffect(() => {
    if (emailClientsIMAP.length > 0 && emailClientsIMAP[0]?.user !== undefined)
      router
        .replace(`./email/${emailClientsIMAP[0].user}/INBOX`)
        .catch(console.log);
  }, [emailClientsIMAP.length]);

  return (
    <div className="flex gap-4">
      {!!isLoading || emailClientsIMAP.length > 0 ? (
        <span>Loading...</span>
      ) : (
        <div className="flex gap-4">
          <Workspace
            cacheKey={entryName}
            // childrenLabels={[]}
            // childrenIcons={[]}
            // defaultPinned={[]}
            // childrenWrapperProps={[]}
            // rightMenuSection={
            //   <Tab
            //     index={-1}
            //     className="p-2"
            //     onClick={() => setOpenSendModal(true)}
            //     onContextMenu={() => {}}
            //   >
            //     <IconPencil />
            //   </Tab>
            // }
            // disablePin
          >
            <span>No emails configured</span>
          </Workspace>
          <EmailSendModal
            opened={openSendModal}
            onClose={(id?: number) => {
              setOpenSendModal(false);
              id !== undefined && void router.push(`/erp/client/${id}`);
            }}
          />
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = createRedirectByRole("employee");

export default EmailPage;
