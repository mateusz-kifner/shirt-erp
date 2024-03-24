import MultiTabs from "@/components/layout/MultiTabs/MultiTabs";
import { Tab } from "@/components/layout/MultiTabs/Tab";
import { useIsMobile } from "@/hooks/useIsMobile";
import EmailFolderTree from "@/page-components/erp/email/EmailFolderTree";
import EmailList from "@/page-components/erp/email/EmailList";
import EmailSendModal from "@/page-components/erp/email/EmailSendModal";
import ErrorPage from "@/pages/_error";
import { trpc } from "@/utils/trpc";
import { cn } from "@/utils/cn";

import { getQueryAsStringOrNull } from "@/utils/query";
import { IconMail } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction, useId, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { createRedirectByRole } from "@/utils/redirectByRole";

function EmailMailbox() {
  const router = useRouter();
  const { user } = router.query;
  const uuid = useId();
  const mailbox: string = (
    getQueryAsStringOrNull(router, "mailbox") ?? "INBOX"
  ).replace("-", "/");
  const { data: emailClients } = trpc.email.getAllConfigs.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const isMobile = useIsMobile();

  const [refreshCounter] = useState(0); // this is hack
  const [openSendModal, setOpenSendModal] = useState<boolean>(false);

  const emailClientsIMAP = emailClients
    ? emailClients.filter((client) => client.protocol === "imap")
    : [];
  // const emailClientsSMTP = emailClients
  //   ? emailClients.filter((client) => client.protocol === "smtp")
  //   : [];

  const emailConfig = emailClientsIMAP.filter(
    (emailClient) => emailClient.user === user,
  )[0];
  if (emailConfig === undefined) return <ErrorPage statusCode={404} />;

  const currentIMAPuser =
    emailClientsIMAP
      .map((val, index) => (val.user === user ? index : null))
      .filter((v) => v !== null)[0] ?? 0;

  const setActive: Dispatch<SetStateAction<number>> = (value) => {
    const active = typeof value === "function" ? value(currentIMAPuser) : value;

    active !== undefined &&
      router
        .push(`/erp/email/${emailClientsIMAP[active]?.user}/INBOX`)
        .catch(console.log);
  };

  return (
    <div
      className={cn(
        "flex flex-grow flex-nowrap items-start gap-4 overflow-hidden p-1 sm:p-4",
        isMobile && "flex-col items-stretch",
      )}
    >
      <MultiTabs
        active={currentIMAPuser}
        setActive={setActive}
        pinned={isMobile ? [0] : []}

        // rightSection={
        //   <Tab
        //     className="p-2"
        //     onClick={() => setOpenSendModal(true)}
        //   >
        //     <IconPencil />
        //   </Tab>
        // }
      >
        {emailClientsIMAP.map((val, index) => (
          <Tab key={`${uuid}${index}`} leftSection={<IconMail />}>
            {val.user}
          </Tab>
        ))}
      </MultiTabs>

      <div className="relative flex flex-col rounded bg-white shadow-lg dark:bg-stone-800">
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
            onActive={(mailbox) => {
              router
                .push(
                  `/erp/email/${user}/${
                    mailbox ? mailbox.replace("/", "-") : "INBOX"
                  }`,
                )
                .catch(console.log);
            }}
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
          <EmailList
            key={`${uuid}${refreshCounter}`}
            emailConfig={emailConfig}
            mailbox={mailbox}
            onSelect={(uid) => {
              router
                .push(
                  `/erp/email/${user}/${
                    mailbox ? mailbox.replace("/", "-") : "INBOX"
                  }/${uid}`,
                )
                .catch(console.log);
            }}
          />
        </ErrorBoundary>
      </div>
      <EmailSendModal
        opened={openSendModal}
        onClose={(id?: number) => {
          setOpenSendModal(false);
          id !== undefined &&
            void router.push(
              `/erp/email/${user}/${
                mailbox ? mailbox.replace("/", "-") : "INBOX"
              }`,
            );
        }}
      />
    </div>
  );
}

export const getServerSideProps = createRedirectByRole("employee");

export default EmailMailbox;
