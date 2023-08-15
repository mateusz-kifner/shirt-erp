import MultiTabs from "@/components/layout/MultiTabs";
import EmailFolderTree from "@/page-components/erp/email/EmailFolderTree";
import EmailSendModal from "@/page-components/erp/email/EmailSendModal";
import EmailView from "@/page-components/erp/email/EmailView";
import ErrorPage from "@/pages/_error";
import { api } from "@/utils/api";
import { getQueryAsIntOrNull, getQueryAsStringOrNull } from "@/utils/query";
import { IconMail } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface EmailMessageProps {}

function EmailMessage(props: EmailMessageProps) {
  const router = useRouter();
  const { user } = router.query;
  const mailbox: string = (
    getQueryAsStringOrNull(router, "mailbox") ?? "INBOX"
  ).replace("-", "/");
  const uid = getQueryAsIntOrNull(router, "uid");
  const [openSendModal, setOpenSendModal] = useState<boolean>(false);

  const { data: emailClients, isLoading } = api.email.getAllConfigs.useQuery(
    undefined,
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );
  const emailClientsIMAP = emailClients
    ? emailClients.filter((client) => client.protocol === "imap")
    : [];
  const emailClientsSMTP = emailClients
    ? emailClients.filter((client) => client.protocol === "smtp")
    : [];

  const emailConfig = emailClientsIMAP.filter(
    (emailClient) => emailClient.user === user,
  )[0];
  if (emailConfig === undefined) return <ErrorPage statusCode={404} />;

  const active =
    emailClientsIMAP
      .map((val, index) => (val.user === user ? index : null))
      .filter((v) => v !== null)[0] ?? 0;

  return (
    <div className="flex flex-grow flex-nowrap items-start gap-4 overflow-hidden p-1 sm:p-4">
      <MultiTabs
        active={active}
        onActive={(active) =>
          active &&
          router.push(`/erp/email/${emailClientsIMAP[active]?.user}/INBOX`)
        }
        pinned={[]}
        onPin={() => {}}
        childrenLabels={emailClientsIMAP.map((val) => val.user)}
        childrenIcons={[IconMail]}
        availableSpace={0}
        // rightSection={
        //   <Tab
        //     value={-1}
        //     className="p-2"
        //     onClick={() => setOpenSendModal(true)}
        //   >
        //     <IconPencil />
        //   </Tab>
        // }
      />

      <div className="relative flex w-40 min-w-[10rem] flex-col rounded bg-white shadow-lg dark:bg-stone-800">
        <ErrorBoundary
          fallback={
            <h1>
              EmailFolderView encountered irreparable error and crashed, please
              reload page.
            </h1>
          }
        >
          <EmailFolderTree
            emailConfig={emailConfig}
            onActive={(mailbox) =>
              router.push(
                `/erp/email/${user}/${
                  mailbox ? mailbox.replace("/", "-") : "INBOX"
                }`,
              )
            }
          />
        </ErrorBoundary>
      </div>
      <div className="relative flex min-h-[16rem] flex-grow flex-col rounded bg-white shadow-lg dark:bg-stone-800">
        <ErrorBoundary
          fallback={
            <h1>
              EmailList encountered irreparable error and crashed, please reload
              page.
            </h1>
          }
        >
          <EmailView emailConfig={emailConfig} mailbox={mailbox} id={uid} />
        </ErrorBoundary>
      </div>
      <EmailSendModal
        opened={openSendModal}
        onClose={(id?: number) => {
          setOpenSendModal(false);
          id !== undefined &&
            router
              .push(
                `/erp/email/${user}/${
                  mailbox ? mailbox.replace("/", "-") : "INBOX"
                }`,
              )
              .catch((e) => {
                throw e;
              });
        }}
      />
    </div>
  );
}

export default EmailMessage;
