import EmailFolderTree from "@/page-components/erp/email/EmailFolderTree";
import EmailView from "@/page-components/erp/email/EmailView";
import ErrorPage from "@/pages/_error";
import { api } from "@/utils/api";
import { getQueryAsIntOrNull, getQueryAsStringOrNull } from "@/utils/query";
import { useRouter } from "next/router";
import { ErrorBoundary } from "react-error-boundary";

interface EmailMessageProps {}

function EmailMessage(props: EmailMessageProps) {
  const router = useRouter();
  const { user } = router.query;
  const mailbox: string = (
    getQueryAsStringOrNull(router, "mailbox") ?? "INBOX"
  ).replace("-", "/");
  const uid = getQueryAsIntOrNull(router, "uid");
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

  return (
    <div className="flex flex-grow flex-nowrap items-start gap-4 overflow-hidden p-1 sm:p-4">
      {/* <MultiTabs
          key={childrenLabels.reduce((prev, next) => prev + next, "")}
          active={tabState.active}
          onActive={setActive}
          pinned={tabState.pinned}
          onPin={togglePin}
          childrenLabels={childrenLabels}
          childrenIcons={childrenIcons}
          availableSpace={width}
          rightSection={rightMenuSection}
          leftSection={leftMenuSection}
        /> */}

      <div className="flex w-40 min-w-[10rem] flex-col rounded bg-white shadow-lg dark:bg-stone-800">
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
      <div className="flex min-h-[16rem] flex-grow flex-col rounded bg-white shadow-lg dark:bg-stone-800">
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
      {/* ))} */}
    </div>
  );
}

export default EmailMessage;
