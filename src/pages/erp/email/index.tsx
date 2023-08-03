import Workspace from "@/components/layout/Workspace";
import EmailSendModal from "@/page-components/erp/email/EmailSendModal";
import { api } from "@/utils/api";
import { getQueryAsIntOrNull } from "@/utils/query";
import { useMediaQuery } from "@mantine/hooks";
import { IconMail } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

const entryName = "email";

interface EmailPageProps {}

function EmailPage(props: EmailPageProps) {
  const {} = props;
  const { data: emailBox } = api.mail.getEmails.useQuery();
  const [openSendModal, setOpenSendModal] = useState<boolean>(false);
  const isMobile = useMediaQuery(
    "only screen and (hover: none) and (pointer: coarse)",
  );
  const router = useRouter();
  const id = getQueryAsIntOrNull(router, "id");

  return (
    <div className="flex gap-4">
      <Workspace
        cacheKey={entryName}
        childrenLabels={emailBox ? emailBox.map((val) => val.user ?? "") : []}
        childrenIcons={[IconMail]}
        defaultActive={0}
        defaultPinned={[]}
        childrenWrapperProps={[]}
        disablePin
      >
        {emailBox &&
          emailBox.map((val) => (
            <div className="relative flex flex-col gap-4 p-4">{val.user}</div>
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
